require('dotenv').config();

import configureStore, { configureStoreWithoutLogger } from '../src/configureStore'

// NOTE: just a simpler store so we don't have to see full
// trace of state after every action
const Store = configureStoreWithoutLogger()

import actions from '../src/actions/search'

const compoundSearch = {
    'allWords': 'medicine'
}

// NOTE: the search dispatches to #fetchSearch in the UI 
// the filter (tabs) are still fetchSearch(compoundSearch, 0, filter)
// and the paging is fetchSearch(compoundSearch, 50..100..150 etc.., filter)
// defaults to start=0
//
Store.dispatch(actions.fetchSearch(compoundSearch)).then(() => {
    const results = Store.getState().search.results
    console.log(results)
    const response = results.response
    console.log(`FOUND=${response.numFound}`)
    const docs = response.docs
    docs.forEach(function(value) {
      console.log(value)
    })
  }
)


