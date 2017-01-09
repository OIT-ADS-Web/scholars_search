import React from 'react'
import { Route, IndexRoute } from 'react-router'

import ScholarsSearchApp from './containers/ScholarsSearchApp'

// NOTE: originally was going to have different routes per
// tab - ergo the separate file - have a route like /person
// didn't work for initializing the app from a URL though
const routes =
<Route path="/">
   <IndexRoute component={ScholarsSearchApp}/> 
</Route>

export default routes

