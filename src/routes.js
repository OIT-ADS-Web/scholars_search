import React, { Component } from 'react'
import { Route, IndexRoute } from 'react-router'

import ScholarsSearchApp from './containers/ScholarsSearchApp'

//onEnter(nextState, replace, callback?)
const onRoutesEnter = function(nextState, replace) {
  // FIXME: something could happen here?
  //console.log("ROUTES ENTERED")

  //console.log(nextState)
  //console.log(replace)
}

// FIXME: tried to get routes like the following
// /people
// /organizations
// 
// with /:tab -- 
// but unable to get it working thus far
// the 'filter' (e.g. tab) is added to the ?<query-params> for now
const routes =
<Route path="/" component={ScholarsSearchApp}  onEnter={onRoutesEnter} >
    <IndexRoute component={ScholarsSearchApp}/>
    { /* <Route path="people" component={ScholarsSearchApp} />*/ }  
</Route>

export default routes

