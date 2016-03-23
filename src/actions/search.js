import fetch from 'isomorphic-fetch'

export const REQUEST_SEARCH  = 'REQUEST_SEARCH';
export const RECEIVE_SEARCH  = 'RECEIVE_SEARCH';
export const NEXT_PAGE       = 'NEXT_PAGE';
export const PAGE_ROWS   = 50;

export const REQUEST_ORGS  = 'REQUEST_ORGS';
export const RECEIVE_ORGS  = 'RECEIVE_ORGS';

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

function requestOrgs() {
  return {
    type: REQUEST_ORGS,
    organizations: []
  }
}

function receiveOrgs(json) {
  return {
    type: RECEIVE_ORGS,
    organizations: json
  }
}

// FIXME: should this set nextPage variable 
// instead of reducuer? e.g.
// start: search.start + PAGE_ROWS
//  
function nextPage() {
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


https://github.com/reactjs/redux/issues/239

*/

import xr from 'xr'

export function loadOrganizationList() {
  // I don't know how you wrote it—maybe using redux-promise or something
  const org_url = config.solr_url
  console.log("search#loadOrganizationList")

  return { 
    type: RECEIVE_ORGS,
    fn: xr.get(config.org_url)
        .then(r => JSON.parse(r.response))
  }
    //.then(json => dispatch(receiveOrgs(json)))
}

export function loadOrganizationsIfNeeded() {
  // This “return a function” form is supported thanks to redux-thunk
  return (dispatch, getState) => {
    if (getState().search.organizations) {
      return; // Exit early!
    }

    return dispatch(loadOrganizationList()); // OK, do that loady thing!
  };
}



export function fetchOrgs() {
  const org_url = config.solr_url
  console.log("search#fetchOrgs")

  return dispatch => {

    dispatch(requestOrgs());

    return xr.get(config.org_url)
      .then(r => JSON.parse(r.response))
      .then(json => dispatch(receiveOrgs(json)))
 
  }
}
 
/*
 *
 *     this.state = {
      query: "",
      departments: [],
      organizations: [],
      searchResult: {
        response: {
          highlighting: {},
        docs: []
        },
        facet_counts: {
          facet_fields: {
            department_facet_string: []
          }
        }
      }
 
*/

function fetchSearch(compoundSearch, start=0) {
  const solr_url = config.solr_url

  // NOTE: recreate SolrQuery object every time there is a
  // search?? should probably be a global object - in the
  // store?   that way we set facets on it etc...
  //
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
  nextPage,
  fetchOrgs
}

