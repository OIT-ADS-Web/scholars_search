import fetch from 'isomorphic-fetch'

export const REQUEST_SEARCH  = 'REQUEST_SEARCH';
export const RECEIVE_SEARCH  = 'RECEIVE_SEARCH';
export const NEXT_PAGE       = 'NEXT_PAGE';
export const PAGE_ROWS   = 50;

export const SOLR_URL =  "http://localhost/ROOTsolr/collection1/select"


var config = require('config');

// FIXME: need a solr query builder that's like these two combined
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

  execute() {
    return xr.get(this.queryString)
  }

}


/*
export class Solr {

  constructor(options) {
    let {
      query:  _query,
      start:  _start=0,
      rows:   _rows=PAGE_ROWS,
      qs:     _qs=SOLR_URL
    } = options;
    
    this.query  = _query;
    this.rows   = _rows;
    this.start  = _start;
    this.qs     = _qs;
  }

  fields() {
    this.qs += "1=1&fl=path,ts_entity_status,ts_duke_status_id,ts_duke_hero_classyear_degree,ts_duke_header_hero_name,url,ts_duke_goes_by_name,label,ts_duke_entity_id,ts_duke_sap_partner,ts_picture_uri";
  }

  filter() {
    this.qs += "&fq=bundle:user&fq=sm_field_duke_status:A";
  }

  json() {
    this.qs += "&wt=json";
  }

  pageinfo() {
    this.qs += `&rows=${this.rows}&start=${this.start}`;
  }

  facet() {
    this.qs += "&facet=true&facet.field=sm_field_duke_classyear";
  }

  q() {
    this.qs += `&q=${this.query}`
  }
  
  build() {
    this.fields();
    this.filter();
    this.json();
    this.pageinfo();
    this.facet();
    this.q();
    return this.qs;
  }
  
}
*/

function requestSearch(searchFields) {
  return {
    type: REQUEST_SEARCH,
    results: {docs: []},
    searchFields
   }
}

function receiveSearch(json) {
  return {
    type: RECEIVE_SEARCH,
    results: json.response,
    receivedAt: Date.now()
  }
}

export function nextPage() {
  return {
    type: NEXT_PAGE
  }
}


// all words = ( word AND word .. )   
// exact match = " word phrase "
// at least one = ( word OR word ..)
// no match = NOT word

//  NOTE: NOT that is alone returns no results
//
//
//  this method will get an object that looks like this?
//
//    const compoundSearch = {
//         'allWords': allWords.value,
//         'exactMatch': exactMatch.value,
//         'atLeastOne': atLeastOne.value,
//         'noMatch': noMatch.value
//      }
 
/*
FIXME since these are added to route - and state - maybe
it should get them from there?

*/

export function fetchSearch(compoundSearch, start=0) {
  return dispatch => {

    // FIXME: has to actually do something with search fields
    //
    dispatch(requestSearch(compoundSearch));

    //SOLR_URL =  "http://localhost/ROOTsolr/collection1/select"
    const solr_url = config.solr_url
 
    // FIXME: add start parameter
    let solr = new SolrQuery(solr_url)
    
    solr.options = {
      wt: "json",
      rows: PAGE_ROWS,
      hl: true,
      start: start
    }
    
    solr.setFilter("type","classgroup:*people")
      
    //solr.setFacetField("department_facet_string",{
    //  prefix: "1|",
    //  mincount: "1"
    //})


    console.log("actions.fetchSearch")

    // FIXME: much do more here to actually build query
    // const qry = solr.buildQuery(compoundSearch) ?
    // solr.setQuery(qry)
    //
    // just searching first field now
    solr.query = compoundSearch.allWords

    console.log(`query: ${compoundSearch.allWords}`)

    return solr.execute()
      .then(r => JSON.parse(r.response))
      .then(json => dispatch(receiveSearch(json)))
 
  }
}


// allow all to be exported at once into an 'action' object
export default {
  fetchSearch,
  nextPage
}

