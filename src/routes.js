import React from 'react'
import { Route, IndexRoute } from 'react-router'

import ScholarsSearchApp from './containers/ScholarsSearchApp'

const routes =
<Route path="/">
   <IndexRoute component={ScholarsSearchApp}/> 
</Route>

export default routes

