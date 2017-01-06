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

// https://www.npmjs.com/package/react-ga
// https://web-design-weekly.com/2016/07/08/adding-google-analytics-react-application/
import ReactGA from 'react-ga'
ReactGA.initialize('UA-38539532-1') //Unique Google Analytics tracking number

function logPageView() {
  console.log(`logging page view: ${window.location}`)

  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
}

// NOTE: another possible way - might work, seems simpler, but havent' figured out how yet
//
/*
// http://stackoverflow.com/questions/34836500/how-to-set-up-google-analytics-for-react-router
history.listen(function (location) {
  console.log(location.pathname)
  console.log(window.ga)
  //window.ga('send', 'pageview', location.pathname);
})
*/

// https://github.com/reactjs/react-router/blob/master/docs/guides/RouteConfiguration.md#decoupling-the-ui-from-the-url
import routes from '../routes'

export default class ScholarsSearch extends Component {
  
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Provider store={store}>
        <Router onUpdate={logPageView} history={history}>
          {routes}
        </Router>
      </Provider>
    )        
  }
}

