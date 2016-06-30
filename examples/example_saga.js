require('dotenv').config();

import { fetchSearch, fetchTabs } from '../src/actions/sagas'
//import { runSaga } from 'redux-saga'

const compoundSearch = { 'allWords': 'medicine'}
// see http://yelouafi.github.io/redux-saga/docs/api/index.html#runsagaiterator-subscribe-dispatch-getstate-monitor

// NOTE: this is a way to run the functions ... a little weird
const myRedux = {
  //subscribe: function(input) { console.log(input) },
  dispatch: function(output) { console.log(output) }
}

/*
const taskSearch = runSaga(
  fetchSearch(compoundSearch),
  myRedux
)

const taskTabs = runSaga(
  fetchTabs(compoundSearch),
  myRedux
)
*/

import { call, put } from 'redux-saga/effects'  
import { fetchSearchApi } from '../src/actions/sagas'
import * as types from '../src/actions/types'

// NOTE: this is a way to see if the 'yield' is the right function
// since it's only 5 lines anyway, this seems like a waste
const fn = fetchSearch(compoundSearch)
let first = fn.next()
console.log(first.value)
console.log(call(fetchSearchApi, compoundSearch))

let second = fn.next()
console.log(second.value)
console.log(put({type: types.RECEIVE_SEARCH}))



