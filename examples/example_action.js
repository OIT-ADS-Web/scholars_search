// run via babel-node examples/example_search.js (must npm install babel-cli --global)

// NOTE: this is needed in console - because
// it's not going through webpack
require('dotenv').config();

import { configureStoreWithoutLogger } from '../src/configureStore'

// NOTE: made this method so I can add 'thunk' middleware, but NOT have the logger
const Store = configureStoreWithoutLogger()

import actions from '../src/actions/search'

// NOTE: this action returns a promise - so we need
// 'then()' to see what happens
Store.dispatch(actions.appInit()).then(() => {
    const departments = Store.getState().init.departments
    departments.forEach(function(value) {
      console.log(value)
    })
  }
)



