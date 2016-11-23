import _ from 'lodash'

import json2csv from 'json2csv'

class Faceter {

  constructor(searcher, field, facet_ids, prefix) {
    this.searcher = searcher
    this.field = field
    this.facet_ids = facet_ids
    this.prefix = prefix
  }

 
  constructFacetFilter(base_id, prefix) {
    // default
    let constructed = `(${base_id})`
 
    // NOTE: got 'undefined field http' error from SOLR
    // when trying to match against URI unless I did this 
    return constructed.replace(':', '\\:')
  }

  // NOTE: this is a bit obtuse, but it's taking a list of the facetIds to apply
  // (obtained from the UI) and then finding the corresponding actual filter
  // that needs to be added to the SOLR query per facetId - and then OR'ing them
  // all together to actually filter the search
  //
  applyFacet() {

    let _self = this

    // get out only the filters like dept_, or type_ so we 
    // are only applying those with this particular Faceter object
    //
    let filters = _.filter(this.facet_ids, (id) => {
      return id.startsWith(`${_self.prefix}_`)
    })

    let list = _.map(filters, (id) => {
      let base_id = id.replace(`${_self.prefix}_`, "")
      let uri_to_search = this.constructFacetFilter(base_id, _self.prefix)

      // FIXME: do we need this check?  
      // I had the idea of being able to add a "_null" to a facet to search for all the 
      // docs that are *not* covered by the facet - but I'm not sure this is ever going
      // to be necessary     
      if (id == `${_self.prefix}_null`) {
        return `(-${_self.field}:[* TO *] AND *:*)`
      } 

      return `${_self.field}:${uri_to_search}`
    })
 
    if(list.length > 0) {
       let or_collection = list.join(' OR ')
       let qry = `{!tag=${this.prefix}}${or_collection}`
       this.searcher.addFilter(`${this.prefix}`, qry)
     }

  }

}

// *********** Filterer, Displayer, Downloader ************* //
//
class TabFilterer {

  constructor(filter) {
    this.filter = filter
    this.facet_ids = []
  }
 

  applyFilters(searcher) {
    // 1. first apply the filter that corresponds to the 'tab'
    if (this.filter) {
      searcher.addFilter("tab", this.filter)
    }
 
    // 2. then apply all facets that filter the results further
    _.forEach(this.facets, (value, key) => {
       this.applyFacet(searcher, value.field, value.prefix, value.options)
    })

  }

  // NOTE: this is called by saga - but happens BEFORE the actual call the SOLR
  applyOptionalFilters(searcher) {
      // NOTE: 'this.facets' is just the mapping from the config
      //
    _.forEach(this.facets, (value, key) => {
      let faceter = new Faceter(searcher, value.field, this.facet_ids, value.prefix)
      faceter.applyFacet()
    })
  }
 
  applyFacet(searcher, field, prefix, options={}) {
    // FIXME: these are a little persnickety, if you leave off the localParam it'll
    // crash - or if you leave off the facetField too
    searcher.setFacetField(field, options)
    searcher.setFacetLocalParam(field, `{!ex=${prefix}}`)
  }

  
  defaultQueryOptions() { 
   // this would possibly be a hook to set query options per tab, for instance
   // if you wanted to search different fields or give different weights to certain
   // fields etc...
   //
   // two problems
   // a) I tried it and it seemed to have no effect on the search
   // b) would, technically, also need to be applied to tabs counts (e.g. the group query 
   //    to get number counts [People(12)][Organizations(4)] etc.... )
   //
   // an example:
   //
   //   qf: 'nameText^200.0 nameUnstemmed^200.0 nameStemmed^200.0 nameLowercase',
   //   pf: 'nameText^200.0 nameUnstemmed^200.0 nameStemmed^200.0 nameLowercase',
  }

  setActiveFacets(chosen_ids) {
    this.facet_ids = chosen_ids
  }
 
}

class TabDisplayer {

  individualDisplay(doc, highlight) {
    return doc.URI
  }

  facetDisplay(facet_counts, chosen_facets, callback, data) { 
    return ""
  }
   
  sortOptions(callback) {
    // FIXME: this is some half-code to set up sorting but how to deal with callback ?? 
    // will probably end up making a <Sorter callback={callback} /> type of component
    return (   
      <select onselect={() => callback()} classname="form-control" defaultvalue="score desc">
        <option value="score desc">relevance</option>
      </select>
    )
  }
 
  results(docs, highlighting) {
    let resultSet = docs.map(doc => { 
        let highlight = highlighting[doc.DocId]
          return this.individualDisplay(doc, highlight)
    })
    return resultSet
  }

}

class TabDownloader {
  
  constructor(fields) {
    this._fields = fields
  }

  toCSV(json) {
    let data = json.response.docs
    let defaultFields = ['URI', {label: 'Type', value: 'mostSpecificTypeURIs.0'}, {label: 'Name', value: 'nameRaw.0'}]
    
    let extraFields = this._fields ? this._fields : []
   
    let allFields = _.concat(defaultFields, extraFields)
 
    let _csv = ""

    if (data) {
      _csv = json2csv({data: data, fields: allFields, flatten: true})
    }

    // NOTE: needs to be an array for Blob function later (in UI)
    let ary = []
    ary.push(_csv)

    return ary
  }


}

// FIXME: should these each be in a separate, short file ??? can't decide
export { TabFilterer, TabDownloader, TabDisplayer }

export default class Tab {

  constructor() { }

  get filterer() {
    return this._filterer || new TabFilterer(this.filter)
  }

  get displayer() {
    return this._displayer || new TabDisplayer()
  }

  get downloader() {
    return this._downloader || new TabDownloader()
  }

  set filterer(filterer) {
    this._filterer = filterer
  }

  set displayer(displayer) {
    this._displayer = displayer
  }

  set downloader(downloader) {
    this._downloader = downloader
  }

}


