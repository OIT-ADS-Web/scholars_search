import SolrQuery from '../utils/SolrQuery'
import * as types from './types'
import { PAGE_ROWS } from './constants'

import { tabList, findTab } from '../tabs'

import { call, put, fork, take, cancel, cancelled  } from 'redux-saga/effects'

import querystring from 'querystring'

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

  // FIXME: would we add another filter here --- 
  //  if (tab should add filter) ... {
  //    let theQuery = helper.buildQuery(searchFields)
  //    searcher.addFilter("concept-name", `nameText:${theQuery}`)
  //  }  
  //

  // searcher.addSort(sort)
  searcher.search =  searchFields

  // FIXME: needs to be in some format that's url composable - but still array
  //
  //let fq_list = searchFields ? (searchFields['facet_queries'] : null) : null
  let fq_list = searchFields ? (searchFields['facet_queries'] ? querystring.parse(searchFields['facet_queries']) : null) : null

  // should these be keyed in the querystring e.g.
  // facet_queries=['sh_name_fcq', 'sh_text_fcq']
  // or 
  // facet_query=sh_name_fcp&facet_query=sh_text_fcq
  //
  console.log(fq_list)
  // NOTE: looks like this
  // Object {0: "{!ex=match}nameText:califf", 1: "{!ex=match}ALLTEXT:califf"}

  _.forEach(fq_list, function(x) {
    // facet queries look like this:
    //{id: 'sh_name_fcq', label: 'Name', query: `{!ex=match}nameText:${base_qry}`}, 
    //searcher.setFacetQuery(x.query)
    searcher.setFacetQuery(x)
  })

//let filter_queries = searchFields ? (searchFields['filter_queries'] : null) : null
  let filter_queries = searchFields ? (searchFields['filter_queries'] ? querystring.parse(searchFields['filter_queries']) : null) : null
  
  console.log(filter_queries)
  // NOTE: looks like this...
  //Object {0: "{!tag=match}nameText:califf"}

  let filter_query_list = []
  _.forEach(filter_queries, function(value, key) {
    filter_query_list.push(value)
  })
  
  // NOTE: these  need to be 'OR'd
  if (filter_query_list.length > 0) {
    // FIXME: better way to get key?  match {!tag=<?>}
    //
    let filterKey = "facets"
    let or_collection = filter_query_list.join(' OR ')
    searcher.addFilter(filterKey, or_collection)
  }

  // searcher.addFilter(
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

