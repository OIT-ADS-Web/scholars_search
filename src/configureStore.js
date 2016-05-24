import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'

import createSagaMiddleware, { END } from 'redux-saga'

const sagaMiddleware = createSagaMiddleware()

const loggerMiddleware = createLogger()

const createStoreWithMiddlewareThunkVersion = applyMiddleware(
  thunkMiddleware,
  loggerMiddleware
)(createStore)

const createStoreWithMiddlewareSagaVersion = applyMiddleware(
  sagaMiddleware,
  loggerMiddleware
)(createStore)


const createStoreWithOnlyThunkMiddleware = applyMiddleware(
  thunkMiddleware
)(createStore)

const createStoreWithOnlySagaMiddleware = applyMiddleware(
    sagaMiddleware
)(createStore)

const initialState = {}

// NOTE: not sure about good naming, organizational method
// needed to split so I can test individual reducers 
//
import reducers from './reducers/search'

export default function configureStoreThunk(initialState = initialState) {
  return createStoreWithMiddlewareThunkVersion(reducers.mainReducer, initialState)
}

export function configureStoreSaga(initialState = initialState) {
  return createStoreWithMiddlewareSagaVersion(reducers.mainReducer, initialState)
}

export function configureStoreWithoutOnlyThunk(initialState = initialState) {
  return createStoreWithOnlyThunkMiddleware(reducers.mainReducer, initialState)
}

export function configureStoreWithOnlySaga(initialState = initialState) {
  return createStoreWithOnlySagaMiddleware(reducers.mainReducer, initialState)
}

export { sagaMiddleware }

