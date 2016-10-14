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

      // FIXME: do we need this check ???      
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


class TabFilterer {

  constructor(filter) {
    this.filter = filter
    this.facet_ids = []
  }
 

  applyFilters(searcher) {
    if (this.filter) {
      searcher.addFilter("tab", this.filter)
    }
 
    _.forEach(this.facets, (value, key) => {
       this.applyFacet(searcher, value.field, value.prefix, value.options)
    })

  }

  // NOTE: this is called by saga - but happens BEFORE the actual call the SOLR
  applyOptionalFilters(searcher) {
      // e.g. this is just mapping from config
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
   // this would possibly be a way to set query options per tab -- two problems
   // a) I tried it and it seemed to have no effect on the search
   // b) would, technically, also need to be applied to tabs (e.g. the group query 
   //    to get number counts [People(12)][Organizations(4)] etc.... )
   //
   //
   //   qf: 'ALLTEXT ALLTEXTUNSTEMMED nameText^200.0 nameUnstemmed^200.0 nameStemmed^200.0 nameLowercase',
   //   pf: 'ALLTEXT ALLTEXTUNSTEMMED nameText^200.0 nameUnstemmed^200.0 nameStemmed^200.0 nameLowercase',
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
    // FIXME: how to deal with callback ?? right now this function does not work - will probably
    // end up making a <Sorter callback={callback} /> type of component
    //
    return (   
      <select onselect={() => callback()} classname="form-control" defaultvalue="score desc">
        <option value="score desc">relevance</option>
      </select>
    )
  }
 
  // FIXME: is this in the right place ???
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
//
export { TabFilterer, TabDownloader, TabDisplayer }

// FIXME: is it better to define that at top, or bottom of file?
//
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


