// FIXME: not using this at the moment
// likely still in dependencies
//import fetch from 'isomorphic-fetch'

var config = require('config');

import xr from 'xr'

export default class SolrQuery {
  constructor(selectUrl){
    this.selectUrl = selectUrl
    this._query = "*.*"
    this._facetFields = {}
    this._options = {}
    this._filters = {}
  }

  set query(query) {
    this._query = query
    return this  
  }

  get query() {
    return this._query
  }

  set options(options) {
    Object.assign(this._options,options)
    return this
  }

  get options() {
    return this._options
  }

  deleteOption(option){
    delete this.options[option];
    return this
  }

  setFacetField(name,options={}) {
    this._facetFields[name] = options
    return this
  }

  deleteFacetField(name) {
    delete this._facetFields[name]
    return this
  }


  getFacetFieldOptions() {
    var facetOptions = {}
    var facets = Object.keys(this._facetFields)
    if (facets.length > 0) {
      facetOptions = {
        facet: true,
        "facet.field": facets
      }
    }
    facets.forEach(facetField => {
      var facetProperties = this._facetFields[facetField]
      Object.keys(facetProperties).forEach(facetProp => {
        facetOptions["f." + facetField + ".facet." + facetProp] = facetProperties[facetProp]
      })
    })
    return facetOptions
  }

  setFilter(name,query) {
    var filter = {}
    filter[name]=query
    Object.assign(this._filters,filter)
    return this
  }

  deleteFilter(name) {
    delete this._filters[name]
    return this
  }

  getFilterOptions() {
    var filterQueries = Object.keys(this._filters).map(filterName => this._filters[filterName])
    return {
      fq:filterQueries
    }
  }

  // Build QueryString manually since built-in xr function won't duplicate array params
  // Need this for multiple facet.field parameters
  get queryString() {
    var queryOptions = Object.assign({q: this.query},this.options,this.getFilterOptions(),this.getFacetFieldOptions())
    var params =  Object.keys(queryOptions).map(key => {
      let value = queryOptions[key]
      if (Array.isArray(value)) {
        // duplicate param name for any array values
        return value.map(v => key + "=" + escape(v)).join('&')
      } else {
        return key + "=" + escape(value)
      }
    }).join('&')
    return this.selectUrl + '?' + params
  }

  buildComplexQuery(compoundSearch = {}) {
    var query = ""

    // FIXME: just defaulting to this now
    // various problems with that - not even checking
    // for blank, for instance
    query = compoundSearch.allWords

    //  this method will get an object that looks like this?
    //
    //    const compoundSearch = {
    //         'allWords': allWords.value,
    //         'exactMatch': exactMatch.value,
    //         'atLeastOne': atLeastOne.value,
    //         'noMatch': noMatch.value
    // }

    // all words = ( word AND word .. )   
    // exact match = " word phrase "
    // at least one = ( word OR word ..)
    // no match = NOT word
  
    //  NOTE: NOT that is alone returns no results

    return query

  }

  execute() {
    return xr.get(this.queryString)
  }

}

