import React, { Component } from 'react'
import { Route, IndexRoute } from 'react-router'

import ScholarsSearchApp from './containers/ScholarsSearchApp'
//import PersonSearchApp from './containers/PersonSearchApp'

const routes =
<Route path="/" component={ScholarsSearchApp} >
    <IndexRoute component={ScholarsSearchApp}/>
    <Route path="people" component={ScholarsSearchApp} />  
</Route>

export default routes

