import SolrQuery from '../utils/SolrQuery'
import * as types from './types'
import { PAGE_ROWS } from './constants'

import { call, put, fork, take, cancel, cancelled  } from 'redux-saga/effects'

import querystring from 'querystring'

import { defaultChosenFacets } from '../utils/TabHelper'

// NOTE: did not import 'requestSearch', 'requestTabCount' (etc...) because
// those are called by containers/components
import { receiveSearch, receiveTabCount, tabCountFailed, searchFailed } from './search'
import { receiveDepartments, departmentsFailed } from './search'

function checkStatus(res) {
  if (res.status >= 400) {
    let message = `Status: ${res.status}`
    throw new Error(message)
    
  }
  return res.json()
}

// NOTE: the basic thing happening here is the application is starting what is 
// seemingly a separate thread or queue of events called a 'saga'.
//
// The UI calls the requestSearch action (for instance) and that's all it has
// to do.  Redux takes care of sending that here as an action type.
//
// The saga itself is like a 'watcher' or listener waiting for notification 
// of a particular event to happen (and ignoring all others)
//
// It 'takes' the event from the queue and does something, which could
// possibly be starting another process and waiting for a response (sort of like 
// a thread).
//
// Then when it gets a response it calls back to same queue with a new
// event. It's up to Redux to dispatch this back to the UI.
// 
// see here:
// http://stackoverflow.com/questions/34570758/why-do-we-need-middleware-for-async-flow-in-redux#answer-34623840
// 
// In particular, I like this idea:
// "Your UI just needs to dispatch what HAS HAPPENED. We only fire events (always in the past tense!) and not actions..."
//
// ***** tabs ******
// 1. actual function
function fetchTabsApi(searchFields, tabList) {
  const solrUrl = process.env.SOLR_URL
  
  let searcher = new SolrQuery(solrUrl)

  searcher.setupTabGroups(tabList)
  searcher.search = searchFields

  return searcher.execute().then(res => checkStatus(res))
}

// 2. what watcher does (see next) 
export function* fetchTabs(action) {
  const { searchFields, tabList } = action

  try {

    const results = yield call(fetchTabsApi,searchFields, tabList) 
    yield put(receiveTabCount(results))
  } catch(e) {
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
 
  searcher.search =  searchFields

  filterer.applyFilters(searcher)
 
  let chosen_ids = defaultChosenFacets(searchFields)
  
  if (chosen_ids) {
    filterer.setActiveFacets(chosen_ids)
  }

  // FIXME: have to always remember to call this *AFTER* setActiveFacets
  // which seems annoying  ... could even be part of the same function call
  filterer.applyOptionalFilters(searcher)

  return searcher.execute().then(res => checkStatus(res))
}

// FIXME: how to cancel? 
// 
// cancel might look like this:
// https://yelouafi.github.io/redux-saga/docs/advanced/TaskCancellation.html

// 2. what watcher will do (see next)
export function* fetchSearch(action) {
  const { searchFields, filterer } = action
 
  try { 
    const results = yield call(fetchSearchApi, searchFields, filterer)

    yield put(receiveSearch(results))
  } catch(e) {
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

// 2. what watcher will do
export function* fetchDepartments() {

  try {
    const results = yield call(fetchDepartmentsApi)

    yield put(receiveDepartments(results))
  } catch(e) {
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

