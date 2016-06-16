// see http://redux.js.org/docs/recipes/WritingTests.html
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import TestUtils from 'react-addons-test-utils'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

import actions from './actions/search'

import { requestSearch, receiveSearch } from './actions/search'

import * as types from './actions/types'

import configureStoreWithoutLogger from './configureStore'

import assert from 'assert'

// NOTE: nock throws no module 'fs' found errors
// tried adding this to webpack-config - no errors at least
// node: {
//   fs: "empty"
// }
import nock from 'nock'

import { fetchSearch, fetchSearchApi } from './actions/sagas'

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
 
describe("SOLR Query", () => {

  const compoundSearch = { 'allWords': 'medicine' }
  var json
  
  // NOTE: needed to do this (calling done())
  // found idea here: https://volaresystems.com/blog/post/2014/12/09/Testing-async-calls-with-Jasmine
  beforeEach(function(done) {
    let results = fetchSearchApi(compoundSearch)

    results.then((res) => {
        json = res
        done()
     })

  })


  it("should connect to solr", () => {
    let hasResponse = json['response']
    assert(hasResponse, true)

  })

})

describe("Running a Search", () => {
  var results = {}
  const store = mockStore({ search: []})
  const compoundSearch = { 'allWords': 'medicine' }

  beforeEach(function() {
    store.dispatch(requestSearch(compoundSearch))
    store.dispatch(receiveSearch(solrJson))
  })

  it("should RECEIVE_SEARCH when running search", () => {
    assert(store.getActions()[0].type == types.REQUEST_SEARCH)
    assert(store.getActions()[1].type == types.RECEIVE_SEARCH)
  })

 
  it ("should return at least ONE doc", () => {
    assert(store.getActions()[1].results.response.docs.length > 0)
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

import { call, put } from 'redux-saga/effects'  

describe("sagas for search", () => {

  const compoundSearch = { 'allWords': 'medicine' }
  const mySaga = fetchSearch({type: types.REQUEST_SEARCH, searchFields: compoundSearch})
 
  it ("should dispatch to fetchSearchApi if fetchSearch called", () => {

   let first = mySaga.next().value

   let fetchFunction = call(fetchSearchApi, compoundSearch)
   assert.equal(first.fn, fetchFunction.fn)
   assert.equal(first.args, fetchFunction.args)
  })

})




