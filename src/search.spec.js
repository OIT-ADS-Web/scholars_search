// see http://redux.js.org/docs/recipes/WritingTests.html
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import TestUtils from 'react-addons-test-utils'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

import actions from './actions/search'
import * as types from './actions/types'

import configureStoreWithoutLogger from './configureStore'

//import expect, { createSpy, spyOn, isSpy } from 'expect'
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
          type: ["http://vivoweb.org/ontology/core#AcademicDepartment"]
        }  
      ]
    }
  }

  // NOTE: I couldn't get the standard Redux way to work
  // see WritingTests link way above

  //const expectedActions = [
  //  { type: types.REQUEST_SEARCH },
  //  { type: types.RECEIVE_SEARCH, body: solrJson }
  //]

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
 

  // NOTE: needed to do this to call expect() and test things 
  // found idea here: https://volaresystems.com/blog/post/2014/12/09/Testing-async-calls-with-Jasmine
  beforeEach(function(done) {
    //  
    store.dispatch(actions.fetchSearch(compoundSearch))
      .then((results) => {
        results = results
        done()
     })
  
  })

  it("should RECEIVE_SEARCH when running search", () => {
    // NOTE: here's an example supposely using isomporphic-search
    // and nock -- 
    // https://github.com/node-nock/nock/issues/399

    // FIXME: this seems like an odd and/or useless test specification
    // just says redux is routing correctly after call to actions.fetchSearch()
    expect(store.getActions()[0].type).toEqual(types.REQUEST_SEARCH)
    expect(store.getActions()[1].type).toEqual(types.RECEIVE_SEARCH)
  
  })

 
  it ("should return at least ONE doc", () => {
    //expect(store.getActions()[1].results.response.docs.length).toBeGreaterThan(0)
    assert(store.getActions()[1].results.response.docs.length > 0)
    // NOTE: if it were using 'nock' this would be true
    //expect(store.getActions()[1].results.response.docs.length).toEqual(1)
  
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

// http://engineering.pivotal.io/post/tdding-react-and-redux/
 
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'

import ScholarsSearch from './containers/ScholarsSearch'
import ScholarsSearchApp from './containers/ScholarsSearchApp'


import SearchForm from './components/SearchForm'
import SearchResults from './components/SearchResults'

import { Router, Route } from 'react-router'

import { createStore } from 'redux'

import { mainReducer, searchReducer } from './reducers/search'

import { applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'

//<Route path="/" component={ScholarsSearchApp}  onEnter={onRoutesEnter} >
 
describe("<ScholarsSearch />", () => {

  var app 
  var store 
  var compoundSearch

  beforeEach(function(done) {
    // FIXME: tried to create simpler store, but couldn't get to work
    //store = mockStore({ search: {results: {}, searchFields: {}}}, applyMiddleware(thunkMiddleware))
    //store = createStore(reducers.searchReducer, { search: {isFetching: false, results: {}}, applyMiddleware(thunkMiddleware))
    store = configureStoreWithoutLogger()
     
    app = TestUtils.renderIntoDocument(<Provider store={store}><div><SearchForm/><SearchResults/></div></Provider>);
    compoundSearch = { 'allWords': 'medicine'}
 
    store.dispatch(actions.fetchSearch(compoundSearch))
      .then((results) => {
        results = results
        done()
     })
 
  })


  it('passes down search results', function() {
     var child =TestUtils.findRenderedComponentWithType(app, SearchResults)
 
     const node = ReactDOM.findDOMNode(child)
     const list = node.querySelectorAll(".search-results-table")

     assert(list[0].children.length > 0)

     const state = store.getState()

     assert(state['search'].searchFields == compoundSearch)

  })
})

// tests to write?  
//
// 1. If you hit search - it puts the searchFields in the store
// 2. If you hit search - it updates the Route path (url)
// 3. If I get results on a tab, it should show page number, back <-> next (if pages > PAGE_ROWS)
 
// use this?
// https://jeremydmiller.com/2016/01/26/how-im-testing-reduxified-react-components/

// describe("Paging Results", () => {
// 
//
//})

// FIXME: use Simulate somewhere?
// https://facebook.github.io/react/docs/test-utils.html
// <button ref="button">...</button>
// var node = this.refs.button;
// ReactTestUtils.Simulate.click(node);



