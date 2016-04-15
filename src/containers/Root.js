import React, { Component } from 'react'
import { Provider } from 'react-redux'
import configureStore from '../configureStore'
//import App from './App'
import ScholarsSearchApp from './ScholarsSearchApp'
//import PersonSearchApp from './PersonSearchApp'

const store = configureStore()

// http://teropa.info/blog/2015/09/10/full-stack-redux-tutorial.html

import { Router, Route, IndexRoute } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

//import { browserHistory } from 'react-router'

// NOTE: the following - it took a while to figure this out and it'll probably change without warning
//https://github.com/reactjs/react-router/issues/353

import { createHistory } from 'history';
import { useRouterHistory } from 'react-router';

// (see above - not crazy about this)
const browserHistory = useRouterHistory(createHistory)({
  basename: '/scholars_search'
});

const history = syncHistoryWithStore(browserHistory, store)

  /*
  match({ routes, location:req.url }, (err, redirect, renderProps) => {
  load(renderProps.components, renderProps.params);

  // at this point, the `load` function has been called on
  // those components matched by `match` that were decorated with `onload`
  });

  */

// http://teropa.info/blog/2015/09/10/full-stack-redux-tutorial.html
// https://github.com/reactjs/react-router/blob/master/docs/guides/RouteConfiguration.md#decoupling-the-ui-from-the-url

import routes from '../routes'

/*
const routes = 
  <Route path="/" component={App} >
    <IndexRoute component={ScholarsSearchApp}/>
    <Route path="/scholars_search/" component={ScholarsSearchApp} >
      <Route path="people/" component={PersonSearchApp} />
    </Route>
</Route>;
*/

/*
const CourseRoute = {
  path: 'course/:courseId',

  getChildRoutes(location, callback) {
    require.ensure([], function (require) {
      callback(null, [
        require('./routes/Announcements'),
        require('./routes/Assignments'),
        require('./routes/Grades'),
      ])
    })
  },

  getIndexRoute(location, callback) {
    require.ensure([], function (require) {
      callback(null, {
        component: require('./components/Index'),
      })
    })
  },

  getComponents(nextState, callback) {
    require.ensure([], function (require) {
      callback(null, require('./components/Course'))
    })
  }
}

// https://github.com/newtriks/generator-react-webpack/issues/141
https://github.com/emmenko/redux-react-router-async-example/blob/master/package.json


"dist": "npm run clean && npm run lint && NODE_ENV=production webpack --config webpack.config.production.js",

*/

export default class Root extends Component {
  
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

