import _ from 'lodash'

import json2csv from 'json2csv'

//let Tab = (superclass) => class extends superclass {
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
    if (this.config.filter) {
      searcher.addFilter("type", this.config.filter)
    }
  }

  // NOTE: should override
  facets(facet_counts) { 
    return ""
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

