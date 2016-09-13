import _ from 'lodash'

import json2csv from 'json2csv'

// IsFaceted --
//
//   applyFilters(searcher)
//   setActiveFacets(chosen_ids) 
//
//
// IsTab --
//
//  mainFilter()
//  sortOptions()
//  toCsv()
//  results()
//  queryOptions()
//  pickDisplay()
//  results()
//
//
//
// FIXME: make like like HasSolrData ??
// let Tab = (superclass) => class extends superclass {
// extends Tab(Component) ???

// render() {
//
// }
//
class Tab {

  
  constructor(config) {
    //super()
    this.config = config
  }
   

  set config(config) {
    this._config = config
  }

  get config() {
    return this._config;
  }

  addContext(data) {
    this.data = data
  }

  applyFilters(searcher) {
    // FIXME: when adding filters have to careful
    // that the name ("tab" in this case) is unique
    // otherwise it'll override
    //
    if (this.config.filter) {
      searcher.addFilter("tab", this.config.filter)
    }
  }

  // ??
  // hasFacets() {
  //   return false
  // }
  //
  //
  // NOTE: should override ---
  facets(facet_counts, chosen_facets, callback, data) { 
    //return ""
    // return (<PeopleFacets />)
  }
  

  //
  defaultQueryOptions() { 
   //   qf: 'ALLTEXT ALLTEXTUNSTEMMED nameText^200.0 nameUnstemmed^200.0 nameStemmed^200.0 nameLowercase',
   //   pf: 'ALLTEXT ALLTEXTUNSTEMMED nameText^200.0 nameUnstemmed^200.0 nameStemmed^200.0 nameLowercase',
  }

  setActiveFacets(chosen_ids) { }
   
  // NOTE: just a default for debugging purposes
  pickDisplay(doc, highlight) {
    return doc.URI
  }

  sortOptions() {
    // FIXME: how to deal with callback ??
    return (   
      <select onselect={() => this.onsort()} classname="form-control" defaultvalue="score desc">
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

  toCSV(json) {
    let data = json.response.docs
    let defaultFields = ['URI', {label: 'Type', value: 'mostSpecificTypeURIs.0'}]
    
    let extraFields = this.csvFields
    
    let firstEntryBeforeSpace = function(row) {
      let str = row['ALLTEXT.0']
      let result = str.substr(0, str.indexOf(' '))
      return result
    }

    let fields = _.concat(defaultFields, extraFields)
    
    let _csv = ""
    if (data) {
      json2csv({data: data, fields: fields, flatten: true}, function(err, csv) {
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

export default Tab

