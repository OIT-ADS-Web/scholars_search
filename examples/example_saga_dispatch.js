require('dotenv').config();

//import { fetchSearch, fetchTabs } from '../src/actions/sagas'
import { runSaga } from 'redux-saga'

const compoundSearch = { 'allWords': 'medicine'}

import { requestSearch, requestTabCount } from '../src/actions/search'
//import { call, put, take } from 'redux-saga/effects'  
//import { fetchSearchApi } from '../src/actions/sagas'
//import * as types from '../src/actions/types'

import { sagaMiddleware } from  '../src/configureStore'
import { configureStoreWithOnlySaga, configureStoreSaga } from '../src/configureStore'

// NOTE: made this method so I can add 'saga' middleware, but NOT have the logger
//const Store = configureStoreSaga()
const Store = configureStoreWithOnlySaga()

import rootSaga from '../src/actions/sagas'

Store.runSaga = sagaMiddleware.run
const task = Store.runSaga(rootSaga)

console.log(task.isRunning())

// NOTE: this is what a component would run
Store.dispatch(requestSearch(compoundSearch))

// but how to do check if it's over, and find the new state?
console.log("**** dispatched ******")

function printState() {
  let state = Store.getState()
  //console.log(state)
  console.log(state.search.results)

}

// FIXME: would like a more deterministic way to see this
// happen.  Not sure how?  periodically check the state over
// and over again until it has changed?
printState()
// wait 3 seconds, then check state again
console.log("*** wait 3 seconds ****")
setTimeout(printState, 3000)

