// FIXME: this seems the wrong place for this
// e.g. containers/ since it does configureStore, sets the Routes
// etc... maybe most of that should be done in ../main.js
import React, { Component } from 'react'
import { Provider } from 'react-redux'

import { sagaMiddleware, configureStoreSaga } from '../configureStore'

const store = configureStoreSaga()
import rootSaga from '../actions/sagas'

store.runSaga = sagaMiddleware.run
store.runSaga(rootSaga)

// http://teropa.info/blog/2015/09/10/full-stack-redux-tutorial.html
import { Router, Route } from 'react-router'
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

