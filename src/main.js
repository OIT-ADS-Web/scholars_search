//import React from 'react';
//import { Router, Route, browserHistory } from 'react-router'
//import { syncHistoryWithStore } from 'react-router-redux'
//import { render } from 'react-dom';

// css gets required in javacript. This will be preprocessed based on the webpack config and 
// inserted into the the head of the document
//require('./styles/main.less')


// Create the Redux Store to keep the application state
//import { createStore } from 'redux'

// load the reducers
//import reducer from './reducers/index'

// Make the store object it self with the reducer and an initial state
//const store = createStore(reducer,{displayMessage:true});
//const history = syncHistoryWithStore(browserHistory, store)

// Setup example subscription - watch the console to see all state changes
// wouldn't do this for real - or would use in dev only
// You could manage top-level React componets like this but react-redux provides
// a better way with optimizations -- see below
//store.subscribe(() =>
//  console.log(store.getState())
//)

// import react-redux helper to connect store to app
//import { Provider } from 'react-redux'
//import SearchForm from './components/SearchForm'

//import { createStore, applyMiddleware } from 'redux'
//import thunkMiddleware from 'redux-thunk'
//import createLogger from 'redux-logger'
//import searchApp from './reducers'

//const loggerMiddleware = createLogger()

//const createStoreWithMiddleware = applyMiddleware(
//  thunkMiddleware,
//  loggerMiddleware
//)(createStore)

//export default function configureStore(initialState) {
//  return createStoreWithMiddleware(searchApp, initialState)
//}

require('./styles/scholars_search.less');

import React from 'react';
import { render } from 'react-dom';
import Root from './containers/Root';

render(
  <Root />,
  document.getElementById('content')
  )


