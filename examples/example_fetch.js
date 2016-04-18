require('dotenv').config();

import configureStore, { configureStoreWithoutLogger } from '../src/configureStore'

const Store = configureStoreWithoutLogger()

import actions from '../src/actions/search'

const compoundSearch = {
    'allWords': 'medicine',
    'exactMatch': '',
    'atLeastOne': '',
    'noMatch': ''
}

// NOTE: the search dispatches to #fetchSearch in the UI 
// the filter (tabs) are still fetchSearch(compoundSearch, 0, filter)
// and the paging is fetchSearch(compoundSearch, 50, ...)
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


