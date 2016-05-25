// FIXME: this seems the wrong place for this
// e.g. containers/Root.js - maybe it should be 
// in ../main.js, or something more like that

import React, { Component } from 'react'
import { Provider } from 'react-redux'
import configureStore from '../configureStore'

import { sagaMiddleware, configureStoreSaga } from '../configureStore'

import ScholarsSearchApp from './ScholarsSearchApp'

//const store = configureStoreThunk()
const store = configureStoreSaga()
import rootSaga from '../actions/sagas'

store.runSaga = sagaMiddleware.run
store.runSaga(rootSaga)

//store.close = () => store.dispatch(END)

// import sagaMiddleware from '../configureStore'
//const store = configureStoreWithSagas()

//import configureStoreWithSaga from '../configureStore'
 
// import sagaMiddleware from '../configureStore'

// import mySaga from '../actions/sagas'
//
//sagaMiddleware.run(helloSaga)

//import rootSaga from '../actions/sagas'
//store.runSaga(rootSaga)

// http://teropa.info/blog/2015/09/10/full-stack-redux-tutorial.html
import { Router, Route, IndexRoute } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

// NOTE: the following - it took a while to figure this out and it'll probably change without warning
//https://github.com/reactjs/react-router/issues/353

import { createHistory } from 'history';
import { useRouterHistory } from 'react-router';

// (see above - not crazy about this)
const browserHistory = useRouterHistory(createHistory)({
  basename: '/scholars_search'
});

const history = syncHistoryWithStore(browserHistory, store)

// https://github.com/reactjs/react-router/blob/master/docs/guides/RouteConfiguration.md#decoupling-the-ui-from-the-url

import routes from '../routes'

// other ways to make routes ...
// https://github.com/newtriks/generator-react-webpack/issues/141
// https://github.com/emmenko/redux-react-router-async-example/blob/master/package.json

export default class ScholarsSearch extends Component {
  
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
        {routes}
        </Router>
      </Provider>
    )        
  }
}

