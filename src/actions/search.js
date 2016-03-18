import fetch from 'isomorphic-fetch'

export const REQUEST_SEARCH  = 'REQUEST_SEARCH';
export const RECEIVE_SEARCH  = 'RECEIVE_SEARCH';
export const NEXT_PAGE       = 'NEXT_PAGE';
export const PAGE_ROWS   = 50;

export const SOLR_URL =  "http://localhost/ROOTsolr/collection1/select"

// FIXME: need a solr query builder that's like these two combined
import xr from 'xr'

export default class SolrQuery {
  constructor(selectUrl){
    this.selectUrl = selectUrl
    this.query = "*.*"
    this.facetFields = {}
    this.options = {}
    this.filters = {}
  }

  set query(query) {
  //setQuery(query) {
    this.query = query
    return this
  }

  set options(options) {
  //setOptions(options){
    Object.assign(this.options,options)
    return this
  }

  deleteOption(option){
    delete this.options[option];
    return this
  }

  //set facetField(name, options={}) {

  setFacetField(name,options={}) {
    this.facetFields[name] = options
    return this
  }

  deleteFacetField(name) {
    delete this.facetFields[name]
    return this
  }


  getFacetFieldOptions() {
    var facetOptions = {}
    var facets = Object.keys(this.facetFields)
    if (facets.length > 0) {
      facetOptions = {
        facet: true,
        "facet.field": facets
      }
    }
    facets.forEach(facetField => {
      var facetProperties = this.facetFields[facetField]
      Object.keys(facetProperties).forEach(facetProp => {
        facetOptions["f." + facetField + ".facet." + facetProp] = facetProperties[facetProp]
      })
    })
    return facetOptions
  }

  setFilter(name,query) {
    var filter = {}
    filter[name]=query
    Object.assign(this.filters,filter)
    return this
  }

  deleteFilter(name) {
    delete this.filters[name]
    return this
  }

  getFilterOptions() {
    var filterQueries = Object.keys(this.filters).map(filterName => this.filters[filterName])
    return {
      fq:filterQueries
    }
  }

  // Build QueryString manually since built-in xr function won't duplicate array params
  // Need this for multiple facet.field parameters
  get queryString() {

  //getQueryString() {
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
    return xr.get(this.getQueryString())
  }

}


/*
 *
 solr.setOptions({
      wt: "json",
      rows: 50,
      hl: true
    }).setFilter("type","classgroup:*people").setFacetField("department_facet_string",{
      prefix: "1|",
      mincount: "1"
    })


*/

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
// this method will get an object that looks like this?
//
//    const compoundSearch = {
//         'allWords': allWords.value,
//         'exactMatch': exactMatch.value,
//         'atLeastOne': atLeastOne.value,
//         'noMatch': noMatch.value
//      }
 
// FIXME: how does this put into ?query params of Router?
// e.g. maybe in component?
//
/*(
    let greeting = findDOMNode(this.refs.greeting).value
    this.context.router.push({
      pathname: '/',
      query: {
        allWords:  compoundSearch.allWords
      }
*/

export function fetchSearch(searchFields, start=0) {
  return dispatch => {
    
    dispatch(requestSearch(searchFields));
    
    //let solr = new SolrQuery(start)

    let s = new Solr({query, start});
    let uri = s.build();
    // executeQuery -->
    // let uri = SolrQuery.queryString
 
    //console.log(`uri: ${uri}`);
    return fetch(uri)
      .then(response => response.json())
      .then(json => dispatch(receiveSearch(json)))
  }
}


// allow all to be exported at once into an 'action' object
export default {
  fetchSearch,
  nextPage
}

