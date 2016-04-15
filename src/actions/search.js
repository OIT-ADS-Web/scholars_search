import fetch from 'isomorphic-fetch'

export const REQUEST_SEARCH  = 'REQUEST_SEARCH';
export const RECEIVE_SEARCH  = 'RECEIVE_SEARCH';
export const NEXT_PAGE       = 'NEXT_PAGE';
export const RESET_PAGE      = 'RESET_PAGE';
export const PREVIOUS_PAGE   = 'PREVIOUS_PAGE';

export const PAGE_ROWS   = 50;

export const REQUEST_ORGS  = 'REQUEST_ORGS';
export const RECEIVE_ORGS  = 'RECEIVE_ORGS';

//export const SWITCH_TAB_BEGIN  = 'SWITCH_TAB_BEGIN';
//export const SWITCH_TAB_END  = 'SWITCH_TAB_END';


import solr from '../utils/SolrQuery'

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

function previousPage() {
  return {
    type: PREVIOUS_PAGE
  }
}

function resetPage() {
  return {
    type: RESET_PAGE
  }
}

export const SET_FILTER = 'SET_FILTER'

function filterSearch(filter) {
  return { type: SET_FILTER, filter: filter }
}


/*
FIXME since these are added to route - and state - maybe
it should get them from there?

https://github.com/reactjs/redux/issues/239

*/


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
  const org_url = process.env.ORG_URL

  //const org_url = "http://localhost/orgservice?getIndex=1&uri=https://scholars.duke.edu/individual/org50000021"


  return dispatch => {

    dispatch(appInitBegin());

    return fetch(org_url)
      .then(r => r.json())
      .then(json => dispatch(appInitEnd(json)))
 
  }
}
 
function fetchOrgs() {
  const org_url = process.env.ORG_URL

  return dispatch => {

    dispatch(requestOrgs());

    return fetch(org_url)
      .then(r => r.json())
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
/* add filter agrument here? 
 *
 */

function fetchSearch(compoundSearch, start=0, filter=null) {
  const solr_url = process.env.SOLR_URL
  
  // NOTE: recreate SolrQuery object every time there is a
  // search?? should probably be a global object - in the
  // store?   that way we set facets on it etc...
  //
  // FIXME: add start parameter
  let searcher = new solr.SolrQuery(solr_url)

  // if start = 0 then reset start here ???
  // start ??  
  searcher.options = {
    wt: "json",
    rows: PAGE_ROWS,
    hl: true,
    start: start
  }

  // NOTE: since we re-create searcher object every time
  // there is no need to use search.deleteFilter("type")
  //
  if (filter) {
    const typeFilters = solr.namedFilters["type"]
    const foundFilter = typeFilters[filter]
    searcher.addFilter("type", foundFilter)
  }

  return dispatch => {

    // NOTE: this is sort of like a flag saying "search has kicked off" 
    dispatch(requestSearch(compoundSearch));

    // const typeFilters = solr.baseFilters["type"]
    // const findFilter = solr.addFilter(typeFilters[filter])
    //
    // solr.addFilter("type", findFilter)
    //

    /*  
    solr.setFacetField("department_facet_string",{
      prefix: "1|",
      mincount: "1"
    })
    */

    searcher.search = compoundSearch

    return searcher.execute()
      .then(r => r.json())
      .then(json => dispatch(receiveSearch(json)))
 
  }
}


// allow all to be exported at once into an 'action' object
export default {
  fetchSearch,
  nextPage,
  previousPage,
  resetPage,
  fetchOrgs,
  appInit,
  filterSearch
}

