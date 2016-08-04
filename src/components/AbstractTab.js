import React, { Component, PropTypes } from 'react'

import _ from 'lodash'

import json2csv from 'json2csv'

// http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
let AbstractTab = (superclass) => class extends superclass {

// TabComposer
// TabRouter
//
//
  /*
  static get contextTypes() {
    return({
      router: PropTypes.object
    })
  }
  */

  constructor(props) {
    super(props)

    //this.handleClickFacet = this.handleClickFacet.bind(this)
    
  }


  toCSV(json) {
    let data = json.response.docs
    let defaultFields = ['URI', {label: 'Type', value: 'mostSpecificTypeURIs.0'}]
    
    let extraFields = this.csvFields()
    
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

  facetQueries(base_query) {
    return []
  }

  filterQueries() {
    return []
  }

  csvFields() {
    return []
  }

  // NOTE: needs this.pickDisplay() defined
  results(docs, highlighting) {
    let resultSet = docs.map(doc => { 
        let highlight = highlighting[doc.DocId]
        return this.pickDisplay(doc, highlight)
    })
    return resultSet
  }

  // NOTE: this needs this.facetQueries() defined
  getFacetQuery(base_query, key) {
    let facetQueries = this.facetQueries(base_query) // just send in blank base_query?
    if (facetQueries.length == 0) {
      return null
    }

    let found = _.find(facetQueries, function(o) { return o.query === key })
    return found
  }


  // NOTE: this needs this.facetQueries() defined
  getFacetQueryLabel(base_query, key) {
    let found = getFacetQuery(base_query, key)

    let label = found ? found.label : `${key} facet not found`
    return label
  }

  findFilterQueryId(filterQueries, qry_match) {
    if (filterQueries.length == 0) {
      return null
    }

    let found = _.find(filterQueries, function(o) { return o.query === qry_match})
    let id = found ? found.id : `${qry} filter not found`
    return id
  }

  findFilterMatches(base_query, filter_queries) {
    let matches = []
    
    let myFilterQueries = this.filterQueries(base_query)
    
    if (myFilterQueries.length == 0) {
      return matches
    }

    let _self = this
    // NOTE: need to flatten this out - now it looks like this (after querystring.parse)
    // Object {0: "{!tag=match}nameText:alejandro"}
    //
    // FIXME: this seems inefficient
    _.forEach(filter_queries, function(f) {

      let match_id = _self.findFilterQueryId(myFilterQueries, f)
      if (match_id) {
        console.log("found match id="+match_id)
        matches.push(match_id)
      }
    })

    return matches
  }


  // FIXME: send in event handler callaback?  so SearchResults component
  // can process ?
  facets(query, facet_queries, chosen_ids=[], cb) {
    let _self = this

    console.log("AbstractTab#facets")
    console.log(facet_queries)

    let facet_list = Object.keys(facet_queries).map(function (key) {
      let item = facet_queries[key]
      
      let facetQuery = _self.getFacetQuery(query, key)

      // if we can't find it - just blank it out
      if (!facetQuery) {
        return ""
      }

      let label = facetQuery.label 

      if (chosen_ids.indexOf(facetQuery.id) > -1) {
        return (
            <li className="list-group-item">
              <input id={facetQuery.id} onClick={(e) => cb(e)} ref={facetQuery.id} type="checkbox" defaultChecked={true} />
              <span className="badge">{item}</span> {label}
            </li>
          )
      } else {
        return (
          <li className="list-group-item">
            <input id={facetQuery.id} onClick={(e) => cb(e)} ref={facetQuery.id} type="checkbox" />
            <span className="badge">{item}</span> {label}
          </li>
        )
      }

      // ??? 
      // if matches a filter query -- (send as parameter) then isChecked = true
      //
      // need Id for checkbox, and event handlers etc...
      //return (<li className="list-group-item"><input type="checkbox" /><span className="badge">{item}</span> {label}</li>)
    })
    let facets = (<ul className="list-group">{facet_list}</ul>)
    return facets
  }


}


// ....
// connect()
//
export default AbstractTab 


//import { connect } from 'react-redux'

//const mapStateToProps = (search, ownProps) => {
//  return { ...search }
//}


//export default connect(mapStateToProps)(AbstractTab) 

