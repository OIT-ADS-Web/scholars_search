import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'

const loggerMiddleware = createLogger()

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  loggerMiddleware
)(createStore)

const createStoreWithThunkMiddleware = applyMiddleware(
  thunkMiddleware
)(createStore)


const initialState = {}

import mainReducer from './reducers/search'

export default function configureStore(initialState = initialState) {
  return createStoreWithMiddleware(mainReducer, initialState)
}

export function configureStoreWithoutLogger(initialState = initialState) {
  return createStoreWithThunkMiddleware(mainReducer, initialState)
}


