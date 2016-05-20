// see http://redux.js.org/docs/recipes/WritingTests.html
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import TestUtils from 'react-addons-test-utils'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

import actions from './actions/search'
import * as types from './actions/types'

import configureStoreWithoutLogger from './configureStore'

import assert from 'assert'

// NOTE: nock throws no module 'fs' found errors
// tried adding this to webpack-config - no errors at least
// node: {
//   fs: "empty"
// }
import nock from 'nock'

describe("Running a Search", () => {
  var results = {}
  const store = mockStore({ search: []})
  const compoundSearch = { 'allWords': 'medicine' }

  // a typical response (abbreviated) ...
  const solrJson = {
      response: {
        numFound: 1, 
        docs: [  
        { 
          mostSpecificTypeURIs: ["http://vivoweb.org/ontology/core#AcademicDepartment"],            
          DocId: "vitroIndividual:https://scholars.duke.edu/individual/org50000844",
          classgroup: ["http://vivoweb.org/ontology#vitroClassGrouporganizations"],
          URI: "https://scholars.duke.edu/individual/org50000844",
          ALLTEXT: ["50000844 Medicine"],
          type: ["http://vivoweb.org/ontology/core#AcademicDepartment"],
          nameRaw: ["Medicine"]
        }  
      ]
    }
  }

  // FIXME: this 'nock' thing is supposed to proxy the call to Solr 
  // (so the test doesn't actually have to hit solr)
  // but it does not do that right now, it just silently skips over

  // NOTE: here's an example supposely using isomporphic-search
  // and nock -- 
  // https://github.com/node-nock/nock/issues/399
  const stub = nock("http://localhost")
    .get("/ROOTsolr/collection1/select")
    .query({q: 'medicine', wt: 'json', rows: '50', hl: 'true', start: '0'})
    .reply(200, { body: solrJson })
 

  // NOTE: needed to do this (calling done())
  // found idea here: https://volaresystems.com/blog/post/2014/12/09/Testing-async-calls-with-Jasmine
  beforeEach(function(done) {
    store.dispatch(actions.fetchSearch(compoundSearch))
      .then((results) => {
        results = results
        done()
     })
  
  })

  it("should RECEIVE_SEARCH when running search", () => {
    assert(store.getActions()[0].type == types.REQUEST_SEARCH)
    assert(store.getActions()[1].type == types.RECEIVE_SEARCH)
  })

 
  it ("should return at least ONE doc", () => {
    assert(store.getActions()[1].results.response.docs.length > 0)
    // NOTE: if it were using 'nock' this would be true
    //assert(store.getActions()[1].results.response.docs.length == 1)
  })



})

import reducers from './reducers/search'

// FIXME: I don't know if this is that useful, just tests whether reducers reduce
describe('search reducer', () => {

  const searchFields = { 'allWords': 'medicine' }

  it('should handle REQUEST_SEARCH', () => {
   
      // FIXME: why is the [] necessary ??
      let action = reducers.searchReducer([], {
        type: types.REQUEST_SEARCH,
        searchFields: searchFields,
        results: null
      })

      let results = {
          isFetching: true,
          results: null,
          searchFields: searchFields
      }
    
    assert.deepEqual(action, results)

  })
  

})

// tried following patterns in this (but largely did not succeed):
// http://engineering.pivotal.io/post/tdding-react-and-redux/
 
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import { Router, Route } from 'react-router'
//import { createStore } from 'redux'
//import { applyMiddleware } from 'redux'
//import thunkMiddleware from 'redux-thunk'

import { syncHistoryWithStore } from 'react-router-redux'
import { createHistory } from 'history';
import { useRouterHistory } from 'react-router';

import ScholarsSearch from './containers/ScholarsSearch'

// NOTE: these are 'unconnected' versions - the problem is SearchTab(s) and PagingPanel
// are 'connected' -- so even trying to test SearchResults as 'shallow' render
// (see https://simonsmith.io/unit-testing-react-components-without-a-dom/) is problematic
//
//import { ScholarsSearchApp } from './containers/ScholarsSearchApp'
//import { SearchForm } from './components/SearchForm'
//import { SearchResults } from './components/SearchResults'

// NOTE: these would be the 'connected' versions
import  ScholarsSearchApp from './containers/ScholarsSearchApp'
import  SearchForm from './components/SearchForm'
import  SearchResults from './components/SearchResults'

//import { mainReducer, searchReducer } from './reducers/search'

describe("<Routing />", () => {

  var app 
  var store 
  var compoundSearch

  beforeEach(function(done) {
    store = configureStoreWithoutLogger()

    const browserHistory = useRouterHistory(createHistory)({
      basename: '/scholars_search'
    });

    const history = syncHistoryWithStore(browserHistory, store)

    app = TestUtils.renderIntoDocument(<Provider store={store}><Router history={history}><ScholarsSearchApp /></Router></Provider>)
       
    compoundSearch = { 'allWords': 'medicine'}
 
    store.dispatch(actions.fetchSearch(compoundSearch))
      .then((results) => {
        results = results
        done()
     })
 
  })


  it('puts search parameters in the route path', function() {
    var child =TestUtils.findRenderedComponentWithType(app, Router)

    // FIXME: I don't understand how I can git location.query here ?? (to test) 
    console.debug(child)

  })


})

describe("<ScholarsSearch />", () => {

  var app 
  var store 
  var compoundSearch

  beforeEach(function(done) {
    store = configureStoreWithoutLogger()
    app = TestUtils.renderIntoDocument(<Provider store={store}><SearchResults/></Provider>)

    compoundSearch = { 'allWords': 'medicine'}
 
    store.dispatch(actions.fetchSearch(compoundSearch))
      .then((results) => {
        results = results
        done()
     })
 
  })


  it('adds search fields to the store', function() {
     var child = TestUtils.findRenderedComponentWithType(app, SearchResults)
      
     const node = ReactDOM.findDOMNode(child)
     const list = node.querySelectorAll(".search-results-table")

     assert(list[0].children.length > 0)

  })

})

// tests to write?  
//
// 1. If you hit search it updates the Route path (url) with parameters
// 2. If I get results on a tab, it should show page number, back <-> next (if pages > PAGE_ROWS)
 
// use this?
// https://jeremydmiller.com/2016/01/26/how-im-testing-reduxified-react-components/




