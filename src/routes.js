import React, { Component } from 'react'
import { Route, IndexRoute } from 'react-router'

import ScholarsSearchApp from './containers/ScholarsSearchApp'

// FIXME: tried to get routes like the following
// /people
// /organizations
// 
// with /:tab -- 
// but unable to get it working thus far
// the 'filter' (e.g. tab) is added to the ?<query-params> for now
// might even want multiple components eventually (where there is a faceted
// sidebar) 
// see https://github.com/reactjs/react-router/blob/master/docs/API.md#named-components
//
//      <Route path="users" components={{main: Users, sidebar: UsersSidebar}}>
//        <Route path="users/:userId" component={Profile} />
//      </Route>
// e.g.
// <Route path="people" components ={{main: PeopleTab, sidebar: PeopleSidebar}}>
//   ??
//
const routes =
<Route path="/" component={ScholarsSearchApp}>
    <IndexRoute component={ScholarsSearchApp}/>
    { /* <Route path="people" component={ScholarsSearchApp} />*/ }  
</Route>

export default routes

