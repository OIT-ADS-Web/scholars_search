require('dotenv').config();

//import assert from 'assert'
//import { sagaMiddleware } from  '../src/configureStore'
//import { configureStoreWithOnlySaga, configureStoreSaga } from '../src/configureStore'

// NOTE: made this method so I can add 'saga' middleware, but NOT have the logger
//const Store = configureStoreSaga()
//const Store = configureStoreWithOnlySaga()

//import rootSaga from '../src/actions/sagas'
import { fetchSearch, fetchTabs } from '../src/actions/sagas'

//import * as types from '../src/actions/types'

import { runSaga } from 'redux-saga'

//Store.runSaga = sagaMiddleware.run
//const task = Store.runSaga(rootSaga)

//sagaMiddleware.run(rootSaga)
//Store.runSaga(rootSaga)

//console.log(task)

const compoundSearch = { 'allWords': 'medicine'}
//import { requestSearch, requestTabCount } from '../src/actions/search'
//import { call, put, take } from 'redux-saga/effects'  

// see http://yelouafi.github.io/redux-saga/docs/api/index.html#runsagaiterator-subscribe-dispatch-getstate-monitor

const myIO = {
  //subscribe: function(input) { console.log(input) },
  dispatch: function(output) { console.log(output) },
}

// monitor()?
const taskSearch = runSaga(
  fetchSearch(compoundSearch),
  myIO
)

const taskTabs = runSaga(
  fetchTabs(compoundSearch),
  myIO
)


import { requestSearch, requestTabCount } from '../src/actions/search'
import { call, put, take } from 'redux-saga/effects'  
import { fetchSearchApi } from '../src/actions/sagas'
import * as types from '../src/actions/types'


const fn = fetchSearch(compoundSearch)
let first = fn.next()
console.log(first.value)
console.log(call(fetchSearchApi, compoundSearch))

let second = fn.next()
console.log(second.value)
console.log(put({type: types.RECEIVE_SEARCH}))

//let third = fn.next()
//console.log(third.value)


// NOTE: there is no guarantee the order these are called or returned
//myIO.dispatch(requestSearch(compoundSearch))
//Store.dispatch(requestTabCount(compoundSearch))



//console.log(task.isRunning())

//console.log(task.result())

//task.done(function(res) {
//  console.log(task.res)
//})

//console.log(rootSaga.isRunning())
//console.log(rootSaga.result())

//rootSaga.done(function() {
//  console.log("done")
//})

//console.log(Store.getState())


//import { requestSearch, requestTabCount } from '../src/actions/search'
//import { call, put, take } from 'redux-saga/effects'  


//import { call, put } from 'redux-saga/effects'  

//const mySaga = loadTodos();  
//import { fetchSearch, fetchSearchApi } from '../src/actions/sagas'

//const mySaga = fetchSearch({type: types.REQUEST_SEARCH, searchFields: compoundSearch})

//console.log(mySaga.next().value)
//console.log(mySaga.next().value)


//let next = mySaga.next()
//let caller = next.value

//console.log(caller.CALL.fn)
//console.log(caller.CALL.args)

//let fn = caller.CALL.fn
//let args = caller.CALL.args

//fn(args)

//assert.deepEqual(mySaga.next().value == call(fetchSearchApi, compoundSearch))
//assert.deepEqual(mySaga.next().value == put({type: types.RECEIVE_SEARCH}))


