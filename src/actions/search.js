import fetch from 'isomorphic-fetch'

export const REQUEST_SEARCH  = 'REQUEST_SEARCH'
export const RECEIVE_SEARCH  = 'RECEIVE_SEARCH'
export const NEXT_PAGE       = 'NEXT_PAGE'
export const RESET_PAGE      = 'RESET_PAGE'
export const PREVIOUS_PAGE   = 'PREVIOUS_PAGE'

export const PAGE_ROWS   = 50

import solr from '../utils/SolrQuery'

// FIXME: should these go here?  that's sort of convention
// but they are sparse routing directions or flag switches
// or traffic directions - not like  actual functions that do 
// anything (as opposed to fetchSearch)
function requestSearch(searchFields) {
  return {
    type: REQUEST_SEARCH,
    results: {responseHeader: {}, response: {}, highlighting: {}},
    isFetching: true,
    searchFields
   }
}

function receiveSearch(json) {
  return {
    type: RECEIVE_SEARCH,
    results: json,
    isFetching: false,
    receivedAt: Date.now()
  }
}

export const REQUEST_TABCOUNTS = 'REQUEST_TABCOUNTS'
export const RECEIVE_TABCOUNTS = 'RECEIVE_TABCOUNTS'

function requestTabCount(searchFields) {
  return {
    type: REQUEST_TABCOUNTS,
    grouped: {},
    isFetching: true,
    searchFields
   }

}

function receiveTabCount(json) {
  let grouped = json.grouped

  return {
    type: RECEIVE_TABCOUNTS,
    grouped: grouped,
    isFetching: false,
    receivedAt: Date.now()
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

// ?
function resetPage() {
  return {
    type: RESET_PAGE,
    start: 0
  }
}

export const SET_FILTER = 'SET_FILTER'

function filterSearch(filter) {
  return { type: SET_FILTER, filter: filter }
}

function resetFilter() {
  return { type: SET_FILTER, filter: 'person' }
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

  return dispatch => {

    dispatch(appInitBegin())

    return fetch(org_url)
      .then(r => r.json())
      .then(json => dispatch(appInitEnd(json)))
 
  }
}

function fetchTabCounts(compoundSearch) {
  const solr_url = process.env.SOLR_URL
  
  let searcher = new solr.SolrQuery(solr_url)

  searcher.setupTabGroups()

  return dispatch => {

    dispatch(requestTabCount(compoundSearch))

    searcher.search = compoundSearch

    return searcher.execute()
      .then(r => r.json())
      .then(json => dispatch(receiveTabCount(json)))
 
  }

}

// FIXME: don't like how filter='person' cause you have to know the
// precise tab list key to put in there, maybe fine though
function fetchSearch(compoundSearch, start=0, filter='person') {
  const solr_url = process.env.SOLR_URL
  
  // NOTE: recreate SolrQuery object every time there is a
  // search?? should probably be a global object - in the
  // store?   that way we set facets on it etc...
  // for now it's fine
  //
  // FIXME: add start parameter
  let searcher = new solr.SolrQuery(solr_url)

  searcher.setupDefaultSearch(start, PAGE_ROWS, filter)

  return dispatch => {

    // NOTE: this is sort of like a flag saying "search has kicked off" 
    dispatch(requestSearch(compoundSearch))

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
  appInit,
  filterSearch,
  resetFilter,
  fetchTabCounts
}

