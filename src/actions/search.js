import fetch from 'isomorphic-fetch'

export const REQUEST_SEARCH  = 'REQUEST_SEARCH';
export const RECEIVE_SEARCH  = 'RECEIVE_SEARCH';
export const NEXT_PAGE       = 'NEXT_PAGE';
export const PAGE_ROWS   = 50;

export const REQUEST_ORGS  = 'REQUEST_ORGS';
export const RECEIVE_ORGS  = 'RECEIVE_ORGS';

var config = require('config');

import SolrQuery from '../utils/SolrQuery'

// FIXME: should these go here?  that's sort of convention
// but they are sparse routing directions or flag switches
// or traffic directions - not like  actual functions that do 
// anything
function requestSearch(searchFields) {
  return {
    type: REQUEST_SEARCH,
    results: {responseHeader: {}, response: {}, highlighting: {}},
    //results: {docs: []},
    searchFields
   }
}

function receiveSearch(json) {
  return {
    type: RECEIVE_SEARCH,
    results: json/*.response*/,
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

function nextPage() {
  return {
    type: NEXT_PAGE
  }
}


 
/*
FIXME since these are added to route - and state - maybe
it should get them from there?


https://github.com/reactjs/redux/issues/239

*/

/* FIXME: couldn't quite these to hook up to an application
 * 'init' event
 */
import xr from 'xr'

// FIXME: still experimenting with how to initialize
// the app with some values
export const APP_INIT_BEGIN = 'APP_INIT_BEGIN'
export const APP_INIT_END = 'APP_INIT_END'

export function appInitBegin() {
  return {
    type: APP_INIT_BEGIN,
    departments: []
  }
}

export function appInitEnd(json) {
  return {
    type: APP_INIT_END,
    departments: json
  }
}


function appInit() {
  const org_url = config.solr_url
  console.log("search#appInit")

  return dispatch => {

    dispatch(appInitBegin());

    return xr.get(config.org_url)
      .then(r => JSON.parse(r.response))
      .then(json => dispatch(appInitEnd(json)))
 
  }
}
 
function fetchOrgs() {
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
 
  this was in the original component, so like need some stuff
  like this to appear in 'state' as some point

 
 
      this.state = {
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
    
  return dispatch => {

    // NOTE: this is sort of like a flag saying "search has kicked off" 
    dispatch(requestSearch(compoundSearch));

    //
    //solr.setFilter("type","classgroup:*people")

    /*
    "classgroup": [
    "http://vivoweb.org/ontology#vitroClassGrouporganizations",

    *
    *
    */


    /*  
    solr.setFacetField("department_facet_string",{
      prefix: "1|",
      mincount: "1"
    })
    */

    console.log("actions.fetchSearch")

    const qry = solr.buildComplexQuery(compoundSearch)

    solr.query = qry

    console.log(`query: ${qry}`)

    // receiveSearch is the counterpart fo requestSearch, like a flag
    // saying "search has completed"
    //   .then(r => JSON.parse(r.response.json()))
    return solr.execute()
      .then(r => JSON.parse(r.response))
      .then(json => dispatch(receiveSearch(json)))
 
  }
}


// allow all to be exported at once into an 'action' object
export default {
  fetchSearch,
  nextPage,
  fetchOrgs,
  appInit
}

