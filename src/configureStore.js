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

// NOTE: not sure about good naming, organizational method
// needed to split so I can test individual reducers 
//
import reducers from './reducers/search'

export default function configureStore(initialState = initialState) {
  return createStoreWithMiddleware(reducers.mainReducer, initialState)
}

export function configureStoreWithoutLogger(initialState = initialState) {
  return createStoreWithThunkMiddleware(reducers.mainReducer, initialState)
}


