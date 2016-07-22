import SolrQuery from '../utils/SolrQuery'
import * as types from './types'
import { PAGE_ROWS } from './constants'

import { tabList, findTab } from '../tabs'

import { call, put, fork, take, cancel, cancelled  } from 'redux-saga/effects'

// NOTE: not import 'requestSearch', 'requestTabCount' because
// those are called by containers/components
import { receiveSearch, receiveTabCount, tabCountFailed, searchFailed } from './search'

// ***** tabs *****
// 1. actual function
function fetchTabsApi(searchFields) {
  const solrUrl = process.env.SOLR_URL
  
  let searcher = new SolrQuery(solrUrl)

  searcher.setupTabGroups(tabList)
  searcher.search = searchFields

  return searcher.execute().then(res => res.json())
}

// 2. what to do 
export function* fetchTabs(action) {
  const { searchFields } = action
  const results = yield call(fetchTabsApi,searchFields) 

  try {
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
export function fetchSearchApi(searchFields, maxRows=PAGE_ROWS) {
  const solrUrl = process.env.SOLR_URL
  let searcher = new SolrQuery(solrUrl)

  // FIXME: need a good way to default these - there is similar logic
  // in at least 3 different places - should not have in to do with in
  // components, AND libraries, AND sagas ....
  //
  let start = searchFields ? Math.floor(searchFields['start'] || 0) : 0
  let filter = searchFields ? (searchFields['filter'] || 'person') : 'person'

  // FIXME: rows should probably be a parameter too 
  // (but within reason e.g. maybe a list of options [50, 100, 200] ...)
  //
  searcher.setupDefaultSearch(maxRows, start)
  
  let tab = findTab(filter) // the tabs are named, and each has 'filter' attribute
  searcher.addFilter("type", tab.filter)
  
  // searcher.addSort(sort)
  searcher.search =  searchFields
 
  let fq_list = searchFields ? (searchFields['facet_queries'] : null) : null

  console.log("fetchSearchApi#adding facet query")

  _.forEach(fq_list, function(x) {
    searcher.setFacetQuery(x)
  })
  
  // FIXME: if this is an error (e.g. the JSON indicates it's an error)
  // nothing is done differently 
  return searcher.execute().then(res => res.json())
}

// FIXME: how to cancel and how to deal with errors
// 
// cancel might look like this:
// https://yelouafi.github.io/redux-saga/docs/advanced/TaskCancellation.html

// 2. what watcher will do
export function* fetchSearch(action) {
  const { searchFields } = action

  const results = yield call(fetchSearchApi, searchFields)

  try {
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
    const searchTask = yield fork(fetchSearch, action)
    //yield fork(fetchSearch, action)
    //yield take(types.SEARCH_CANCELLED)
    //yield cancel(searchTask)
  }
}

import fetch from 'isomorphic-fetch'

// ***** departments *****
// 1. actual function
export function fetchDepartmentsApi() {
  const orgUrl = process.env.ORG_URL
  let attempt = fetch(orgUrl)
  return attempt.then(res => res.json())
}

export function* fetchDepartments() {
  const results = yield call(fetchDepartmentsApi)

  try {
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


// FIXME: add a fork(watchForDownload)
//
//
// all of them, wrapped up for middleware
export default function* root() {
  yield [
    fork(watchForSearch),
    fork(watchForTabs),
    fork(watchForDepartments)
  ]
}

