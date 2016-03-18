import React, { Component } from 'react'
import { Provider } from 'react-redux'
import configureStore from '../configureStore'
import ScholarsSearchApp from './ScholarsSearchApp'

const store = configureStore()

import { Router, Route, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

const history = syncHistoryWithStore(browserHistory, store)

// FIXME: routes - named match to determine 'tab'
//
export default class Root extends Component {
  
  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <Route path="search/:tab" component={ScholarsSearchApp}/> 
          <Route path="/" component={ScholarsSearchApp} />
        </Router>
      </Provider>
    )        
  }
}

