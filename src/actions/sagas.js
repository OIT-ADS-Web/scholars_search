import SolrQuery from '../utils/SolrQuery'
import * as types from './types'
import { PAGE_ROWS } from './constants'

import { call, put, fork, take, cancel, cancelled  } from 'redux-saga/effects'

import querystring from 'querystring'

// NOTE: not import 'requestSearch', 'requestTabCount' because
// those are called by containers/components
import { receiveSearch, receiveTabCount, tabCountFailed, searchFailed } from './search'

// same as above
import { receiveDepartments, departmentsFailed } from './search'

function checkStatus(res) {
  if (res.status >= 400) {
    let message = `Status: ${res.status}`
    throw new Error(message)
    
  }
  return res.json()
}

// ***** tabs *****0
// 1. actual function
function fetchTabsApi(searchFields, tabList) {
  const solrUrl = process.env.SOLR_URL
  
  let searcher = new SolrQuery(solrUrl)

  searcher.setupTabGroups(tabList)
  searcher.search = searchFields

  return searcher.execute().then(res => checkStatus(res))
}

// 2. what to do 
export function* fetchTabs(action) {
  const { searchFields, tabList } = action

  try {

    const results = yield call(fetchTabsApi,searchFields, tabList) 
    yield put(receiveTabCount(results))
  } catch(e) {
    // FIXME: not actually prepared for error in application
    yield put(tabCountFailed(e.message))
  }

}
// 3. watcher
function* watchForTabs() {
  while(true) {
    const action = yield take(types.REQUEST_TABCOUNTS)
    yield fork(fetchTabs, action)
  }
}


// ********* search ******
// 1. actual function
export function fetchSearchApi(searchFields, filterer, maxRows=PAGE_ROWS) {
  const solrUrl = process.env.SOLR_URL
  let searcher = new SolrQuery(solrUrl)

  let start = searchFields ? Math.floor(searchFields['start'] || 0) : 0
  
  // FIXME: rows should probably be a parameter too 
  // (but within reason e.g. maybe a list of options [50, 100, 200] ...)
  //
  searcher.setupDefaultSearch(maxRows, start)
 
  // in theory should either
  // a) remove facetIds or
  // b) incorporate facetIds into building the search
  //
  searcher.search =  searchFields

  // NOTE: apply filters last, after search has been defined
  filterer.applyFilters(searcher)
 
  // FIXME: this exact same check is in multiple places
  let chosen_ids = searchFields['facetIds'] ? searchFields['facetIds'] : []
   
  // have to convert to array if it's a single value
  if (typeof chosen_ids === 'string') {
    chosen_ids = [chosen_ids]
  }
  
  if (chosen_ids) {
    filterer.setActiveFacets(chosen_ids)
  }

  // FIXME: have to remember to call this AFTER setActiveFacets ... 
  // could even be part of the same function call
  filterer.applyOptionalFilters(searcher)

  return searcher.execute().then(res => checkStatus(res))
}

// FIXME: how to cancel and how to deal with errors
// 
// cancel might look like this:
// https://yelouafi.github.io/redux-saga/docs/advanced/TaskCancellation.html

// 2. what watcher will do
export function* fetchSearch(action) {
  const { searchFields, filterer } = action
 
  try { 
    const results = yield call(fetchSearchApi, searchFields, filterer)

    yield put(receiveSearch(results))
  } catch(e) {
    // FIXME: not actually prepared for error in application
    yield put(searchFailed(e.message))
  } finally {
    if (yield cancelled()) {
      //yield put(searchCancelled(message))
    }
  }  

}

// 3. watcher
function* watchForSearch() {
  while(true) {
    const action = yield take(types.REQUEST_SEARCH)
    
    // NOTE: if I change it to this (per cancel example)
    // if spins forever
    // yield take(types.SEARCH_CANCELLED)
    // yield cancel(searchTask)
    const searchTask = yield fork(fetchSearch, action)
  }
}

import fetch from 'isomorphic-fetch'

// ***** departments *****
// 1. actual function
export function fetchDepartmentsApi() {
  const orgUrl = process.env.ORG_URL
  let attempt = fetch(orgUrl)

  return attempt.then(res => checkStatus(res))

}

export function* fetchDepartments() {

  try {
    const results = yield call(fetchDepartmentsApi)

    yield put(receiveDepartments(results))
  } catch(e) {
    // FIXME: not actually prepared for error in application
    yield put(departmentsFailed(e.message))
  } 
}


// 3. watcher
function* watchForDepartments() {
  while(true) {
    const action = yield take(types.REQUEST_DEPARTMENTS)
    yield fork(fetchDepartments, action)
  }
}


// all of them, wrapped up for middleware
export default function* root() {
  yield [
    fork(watchForSearch),
    fork(watchForTabs),
    fork(watchForDepartments)
  ]
}

