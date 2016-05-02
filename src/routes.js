import React, { Component } from 'react'
import { Route, IndexRoute } from 'react-router'

import ScholarsSearchApp from './containers/ScholarsSearchApp'
//import PersonSearchApp from './containers/PersonSearchApp'

//onEnter(nextState, replace, callback?)

const onRoutesEnter = function(nextState, replace) {
  // something happen here?
  console.log("ROUTES ENTERED")

  console.log(nextState)
  console.log(replace)

}

const routes =
<Route path="/" component={ScholarsSearchApp}  onEnter={onRoutesEnter} >
    <IndexRoute component={ScholarsSearchApp}/>
    { /* <Route path="people" component={ScholarsSearchApp} />*/ }  
</Route>

export default routes

