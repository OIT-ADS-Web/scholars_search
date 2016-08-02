import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

import querystring from 'querystring'

import { requestSearch } from '../actions/search'

import solr from '../utils/SolrHelpers'

import _ from 'lodash'

import { fetchSearchApi } from '../actions/sagas'

import json2csv from 'json2csv'

// http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
let AbstractTab = (superclass) => class extends superclass {

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
  getFacetQueryLabel(base_query, key) {
    let facetQueries = this.facetQueries(base_query) // just send in blank base_query?
    if (facetQueries.length == 0) {
      return "?"
    }

    let found = _.find(facetQueries, function(o) { return o.query === key })
    // FIXME: what if not found? means we sent in facet query (in query parameters)
    // but weren't expecting it
    let label = found ? found.label : `${key} facet not found`
    return label
  }


  facets(query, facet_queries) {
    let _self = this
    let facet_list = Object.keys(facet_queries).map(function (key) {
      let item = facet_queries[key]
      // FIXME: how to get label ?? <*Tab>.getFacetQueryLabel(key)
      // I don't like having to build the query here to find the label (because it's matching keys to keys 
      // constructed in separate places which can potentially create suprising errors)
      //
      let label = _self.getFacetQueryLabel(query, key)
      // need Id for checkbox, and event handlers etc...
      return (<li className="list-group-item"><input type="checkbox" /><span className="badge">{item}</span> {label}</li>)
    })
    let facets = (<ul className="list-group">{facet_list}</ul>)
    return facets
  }


}


export default AbstractTab 

