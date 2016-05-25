import fetch from 'isomorphic-fetch'

import SolrQuery from '../utils/SolrQuery'

import * as types from './types'
import { PAGE_ROWS } from './constants'

export function requestSearch(searchFields) {
  return {
    type: types.REQUEST_SEARCH,
    results: {responseHeader: {}, response: {}, highlighting: {}},
    isFetching: true,
    searchFields: searchFields
   }
}

export function receiveSearch(json) {
  return {
    type: types.RECEIVE_SEARCH,
    results: json,
    isFetching: false,
    receivedAt: Date.now()
  }
}

export function requestTabCount(searchFields) {
  return {
    type: types.REQUEST_TABCOUNTS,
    grouped: {},
    isFetching: true,
    searchFields: searchFields
   }

}

export function receiveTabCount(json) {
  let grouped = json.grouped

  return {
    type: types.RECEIVE_TABCOUNTS,
    grouped: grouped,
    isFetching: false,
    receivedAt: Date.now()
  }

}

export function cancelSearch() {
  return {
    type: types.SEARCH_CANCELLED
  }
}

export function searchFailed() {
  return {
    type: types.SEARCH_FAILED
  }
}

/*
function nextPage() {
  return {
    type: types.NEXT_PAGE
  }
}

function previousPage() {
  return {
    type: types.PREVIOUS_PAGE
  }
}

function resetPage() {
  return {
    type: types.RESET_PAGE,
    start: 0
  }
}

export function requestFilter(filter) {
  return { type: types.SET_FILTER, filter: filter }
}


function filterSearch(filter) {
  return { type: types.SET_FILTER, filter: filter }
}

function resetFilter() {
  return { type: types.SET_FILTER, filter: 'person' }
}
*/

/*
FIXME since these are added to route - and state - maybe
it should get them from there?

https://github.com/reactjs/redux/issues/239

*/


// FIXME: still experimenting with how to initialize
// the app with some values, not actually using
// these deparments right now
/*
export function appInitBegin() {
  return {
    type: types.APP_INIT_BEGIN,
    departments: []
  }
}

export function appInitEnd(json) {
  return {
    type: types.APP_INIT_END,
    departments: json
  }
}
*/

// *********** actions that actually do something **********/

// THUNK VERSIONS
/*
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
  
  let searcher = new SolrQuery(solr_url)

  searcher.setupTabGroups()

  return dispatch => {

    dispatch(requestTabCount(compoundSearch))

    searcher.search = compoundSearch

    return searcher.execute()
      .then(r => r.json())
      .then(json => dispatch(receiveTabCount(json)))
 
  }

}
*/

// FIXME: don't like how filter='person' cause you have to know the
// precise tab list key to put in there, maybe fine though
/*
function fetchSearch(compoundSearch, start=0, filter='person') {
  const solr_url = process.env.SOLR_URL
  
  // NOTE: recreate SolrQuery object every time there is a
  // search?? should probably be a global object - in the
  // store?   that way we set facets on it etc...
  // for now it's fine
  let searcher = new SolrQuery(solr_url)

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
*/

// allow all to be exported at once into an 'action' object
export default {
  //fetchSearch,
  //nextPage,
  //previousPage,
  //resetPage,
  //appInit,
  //filterSearch,
  //resetFilter,
  //fetchTabCounts
}

