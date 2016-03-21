import React, { Component } from 'react'
import { Provider } from 'react-redux'
import configureStore from '../configureStore'
import ScholarsSearchApp from './ScholarsSearchApp'

const store = configureStore()

import { Router, Route, IndexRoute } from 'react-router'
//import { createHistory } from 'history';

import { syncHistoryWithStore } from 'react-router-redux'

import { browserHistory } from 'react-router'

//const browserHistory = useRouterHistory(createHistory)({
//   basename: '/scholars_search'
//});


const history = syncHistoryWithStore(browserHistory, store)

// FIXME: routes - named match to determine 'tab'
//
//
//http://localhost/scholars_search/?allWords=alejandro&atLeastOne=&exactMatch=&noMatch=
//
//
//
//
//import { createHistory } from 'history';
//import { Router, useRouterHistory } from 'react-router';

//const browserHistory = useRouterHistory(createHistory)({
//            basename: '/whatever'
//        });

export default class Root extends Component {
  
  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <Route path="scholars_search/" component={ScholarsSearchApp} >
            <IndexRoute component={ScholarsSearchApp}/>
            <Route path=":tab" component={ScholarsSearchApp}/> 
          </Route>
        </Router>
      </Provider>
    )        
  }
}

