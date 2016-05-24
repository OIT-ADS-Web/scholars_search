import SolrQuery from '../utils/SolrQuery'
import * as types from './types'
import { PAGE_ROWS } from './constants'

import { takeEvery, takeLatest } from 'redux-saga'
import { call, put, fork, take } from 'redux-saga/effects'

import { receiveSearch, receiveTabCount } from './search'

// ***** tabs *****
// 1. actual function
function fetchTabsApi(searchFields) {
  const solr_url = process.env.SOLR_URL
  
  let searcher = new SolrQuery(solr_url)

  searcher.setupTabGroups()
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
    console.log(e.message)
    yield put({type: "TAB_COUNT_FAILED", message: e.message})
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
export function fetchSearchApi(searchFields) {
  const solr_url = process.env.SOLR_URL
  let searcher = new SolrQuery(solr_url)

  // FIXME: need a good way to default these 
  let start = searchFields ? Math.floor(searchFields['start']) : 0
  let filter = searchFields ? (searchFields['filter'] || 'person') : 'person'

  searcher.setupDefaultSearch(start, PAGE_ROWS, filter)
  searcher.search =  searchFields
 
  // FIXME: if this is an error (e.g. the JSON indicates it's an error)
  // nothing is done differently 
  return searcher.execute().then(res => res.json())
}


// 2. what watcher will do
export function* fetchSearch(action) {
  const { searchFields } = action
  const results = yield call(fetchSearchApi, searchFields)

  //console.log(results.responseHeader.status)
  //console.log(results.responseHeader.params)

  try {
    yield put(receiveSearch(results))
  } catch(e) {
    // FIXME: not actually prepared for error in application
    console.log(e.message)
    yield put({type: "SEARCH_FAILED", message: e.message})
  }

}

// 3. watcher
function* watchForSearch() {
  while(true) {
    const action = yield take(types.REQUEST_SEARCH)
    yield fork(fetchSearch, action)
  }
}

// all of them, wrapped up for middleware
export default function* root() {
  yield [
    fork(watchForSearch),
    fork(watchForTabs)
  ]
}

