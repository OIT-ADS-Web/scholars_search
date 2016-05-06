// see http://redux.js.org/docs/recipes/WritingTests.html
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

import actions from './actions/search'
import * as types from './actions/types'

import configureStoreWithoutLogger from './configureStore'

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

  // a typical response ...
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

  // NOTE: I couldn't get the standard Redux wayt work
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
    expect(store.getActions()[1].results.response.docs.length).toBeGreaterThan(1)
    // NOTE: if it were using 'nock' this would be true
    //expect(store.getActions()[1].results.response.docs.length).toEqual(1)
  
  })



})
