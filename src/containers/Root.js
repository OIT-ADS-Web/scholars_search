import React, { Component } from 'react'
import { Provider } from 'react-redux'
import configureStore from '../configureStore'
import ScholarsSearchApp from './ScholarsSearchApp'

const store = configureStore()

import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

const history = syncHistoryWithStore(browserHistory, store)

// FIXME: routes - named match to determine 'tab'
//
export default class Root extends Component {
  
  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <Route path="/" component={ScholarsSearchApp} >
            <IndexRoute component={ScholarsSearchApp}/>
            <Route path=":tab" component={ScholarsSearchApp}/> 
          </Route>
        </Router>
      </Provider>
    )        
  }
}

