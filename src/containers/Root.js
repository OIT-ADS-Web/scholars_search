import React, { Component } from 'react'
import { Provider } from 'react-redux'
import configureStore from '../configureStore'
import ScholarsSearchApp from './ScholarsSearchApp'

const store = configureStore()

// FIXME: is there a way to preload orgs/departments like
// this (see below)?
//
// http://teropa.info/blog/2015/09/10/full-stack-redux-tutorial.html

//import fetchOrgs from '../actions/search'

//store.dispatch(fetchOrgs)
/*
store.dispatch({
  type: 'REQUEST_ORGS',
  state: {
    vote: {
      pair: ['Sunshine', '28 Days Later'],
      tally: {Sunshine: 2}
    }
  }
});
*/

import { Router, Route, IndexRoute } from 'react-router'
//import { createHistory } from 'history';

import { syncHistoryWithStore } from 'react-router-redux'

import { browserHistory } from 'react-router'

//const browserHistory = useRouterHistory(createHistory)({
//   basename: '/scholars_search'
//});


const history = syncHistoryWithStore(browserHistory, store)

//import fetchOrgs from '../actions/search'

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

//https://github.com/Download/redux-load-api
//
/*
 *
import { onload, load } from 'redux-load-api';

  export function onload(fn) {
  return Component => {Component.onload = fn;   return Component;};
}

export function load(components, params) {
  return Promise.all(components
    .filter(component => component.onload)
    .map(component => Promise.resolve(component.onload(params)))
  );
}

*/


  /*
  match({ routes, location:req.url }, (err, redirect, renderProps) => {
  load(renderProps.components, renderProps.params);

  // at this point, the `load` function has been called on
  // those components matched by `match` that were decorated with `onload`
  });

  */

// http://teropa.info/blog/2015/09/10/full-stack-redux-tutorial.html

const routes = <Route path="scholars_search/" component={ScholarsSearchApp} >
  <IndexRoute component={ScholarsSearchApp}/>
  <Route path=":tab" component={ScholarsSearchApp}/> 
</Route>;
 

import loadOrganizationsIfNeeded from '../actions/search'

import appInit from '../actions/search'
import helloTest from '../actions/search'

export default class Root extends Component {
  
  constructor(props) {
    super(props)
    // FIXME: can't get this to work so far, just
    // trying to load organization at init time
    //Root.js:105 Uncaught TypeError: (0 , _search2.default) is not a function

    //this.props.dispatch(loadOrganizationsIfNeeded())
  
    //helloTest()

    //this.props.dispatch(helloTest())

  }


  componentDidMount() {
    // FIXME: is this still something called?
    console.log("Root#componentDidMount")
    //this.props.dispatch(appInit())
    //appInit()
     
  }

  render() {
    return (
      <Provider store={store}>
        <Router history={history}>{routes}</Router>
      </Provider>
    )        
  }
}

