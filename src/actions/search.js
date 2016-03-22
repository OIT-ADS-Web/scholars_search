import fetch from 'isomorphic-fetch'

export const REQUEST_SEARCH  = 'REQUEST_SEARCH';
export const RECEIVE_SEARCH  = 'RECEIVE_SEARCH';
export const NEXT_PAGE       = 'NEXT_PAGE';
export const PAGE_ROWS   = 50;

export const SOLR_URL =  "http://localhost/ROOTsolr/collection1/select"

var config = require('config');

import SolrQuery from '../utils/SolrQuery'

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

// FIXME: should this set nextPage variable 
// instead of reducuer? e.g.
// start: search.start + PAGE_ROWS
//  
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
  const solr_url = config.solr_url

  // NOTE: recreate SolrQuery object every time there is a
  // search??  
  // FIXME: add start parameter
  let solr = new SolrQuery(solr_url)
    
  solr.options = {
    wt: "json",
    rows: PAGE_ROWS,
    hl: true,
    start: start
  }
    
  //solr.setFilter("type","classgroup:*people")
 
  return dispatch => {

    // FIXME: has to actually do something with search fields
    //
    dispatch(requestSearch(compoundSearch));


    //const solr_url = config.solr_url

    // NOTE: recreate SolrQuery object every time there is a
    // search??  
    // FIXME: add start parameter
    //let solr = new SolrQuery(solr_url)
    
    //solr.options = {
    //  wt: "json",
    //  rows: PAGE_ROWS,
    //  hl: true,
    //  start: start
    //}
    
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

