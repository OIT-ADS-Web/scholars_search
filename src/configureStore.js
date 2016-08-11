import { createStore, applyMiddleware } from 'redux'

import createLogger from 'redux-logger'
import createSagaMiddleware from 'redux-saga'

const sagaMiddleware = createSagaMiddleware()
const loggerMiddleware = createLogger()

// FIXME: don't like all these versions of basically the same thing
const createStoreWithMiddlewareSagaVersion = applyMiddleware(
  sagaMiddleware,
  loggerMiddleware
)(createStore)

const createStoreWithOnlySagaMiddleware = applyMiddleware(
    sagaMiddleware
)(createStore)


// FIXME: add tablist here?
const initialState = {}

// NOTE: not sure about good naming, organizational method
// needed to split so I can test individual reducers 
//
import reducers from './reducers/search'

export function configureStoreSaga(initialState = initialState) {
  return createStoreWithMiddlewareSagaVersion(reducers.mainReducer, initialState)
}

export function configureStoreWithOnlySaga(initialState = initialState) {
  return createStoreWithOnlySagaMiddleware(reducers.mainReducer, initialState)
}

export { sagaMiddleware }

