import _ from 'lodash'

import json2csv from 'json2csv'

class TabFilterer {

  constructor(filter) {
    this.filter = filter
    
    this.facet_ids = []
  }
   
  applyFilters(searcher) {
    // FIXME: when adding filters have to careful
    // that the name ("tab" in this case) is unique
    // otherwise it'll override.  So ... it's a potential
    // cause for confusion.  Perhaps utils/Solr should throw a 
    // 'key already in use' type of error
    //
    if (this.filter) {
      searcher.addFilter("tab", this.filter)
    }
  }

  applyFacet(searcher, field, prefix, options={}) {
    // FIXME: these are a little persnickety, if you leave off the localParam it'll
    // crash - or if you leave off the facetField too
    searcher.setFacetField(field, options)
    searcher.setFacetLocalParam(field, `{!ex=${prefix}}`)
  }

  
  applyOptionalFilters(searcher) { /* noop */ }

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

  // hasFacets() { ???? }
  //
  // NOTE: tab with facets should override ---
  facets(facet_counts, chosen_facets, callback, data) { 
    return ""
  }
  
  // NOTE: just a default for debugging purposes
  pickDisplay(doc, highlight) {
    return doc.URI
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
        return this.pickDisplay(doc, highlight)
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
    let defaultFields = ['URI', {label: 'Type', value: 'mostSpecificTypeURIs.0'}]
    
    let extraFields = this._fields
   
    let allFields = _.concat(defaultFields, extraFields)
    
    let _csv = ""

    if (data) {
      json2csv({data: data, fields: allFields, flatten: true}, function(err, csv) {
        if (err) {
          console.log(err)
        }
        else {
          _csv = csv
        }
      })
    }

    // NOTE: needs to be an array for Blob function do that here?
    let ary = []
    ary.push(_csv)
    return ary
  }


}

class FacetHelper {
  
  parseFacetFields(facet_fields) {
    // FIXME: this could be generalized in base Component of some sort
    //
    // 1) first parse our search/facet_fields results
    let results = {}
    _.forEach(facet_fields, function(value, key) {
      results[key] = []
      
      let array = value

      let size = array.length
      let i = 0
      // strangely results are array, of [<count><field>, <count><field> ... ]
      while (i < size) {
        let label = array[i]
        let count = array[i+1]
        let summary = {label: label, count:count}
        results[key].push(summary)

        i = i + 2
      }
    })

    return results
  }

}

class Faceter {

  constructor(searcher, field, facet_ids, prefix) {
    this.searcher = searcher
    this.field = field
    this.facet_ids = facet_ids
    this.prefix = prefix
  }


  applyFacet() {

    let _self = this

    let filters = _.filter(this.facet_ids, (id) => {
      return id.startsWith(`${_self.prefix}_`)
    })

    let list = _.map(filters, (id) => {
      /*
     
      people by departments is like this: ---

      let uri_to_search = `(1|*individual/${id})`.replace("dept_", "")  // FIXME: this must be wrong
      
    */

      let uri_to_search = `(*${id})`.replace(`${_self.prefix}_`, "") 
      
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


export { TabFilterer, TabDownloader, TabDisplayer, Faceter }


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


