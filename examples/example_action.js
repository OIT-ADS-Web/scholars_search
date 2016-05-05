require('dotenv').config();

import configureStore, { configureStoreWithoutLogger } from '../src/configureStore'

// NOTE: made this method so I can add 'thunk' middleware, but NOT have the logger
const Store = configureStoreWithoutLogger()

import actions from '../src/actions/search'

// NOTE: this action returns a promise - so we need
// 'then()' to see what happens
Store.dispatch(actions.appInit()).then(() => {
    const departments = Store.getState().init.departments
    departments.forEach(function(value) {
      //console.log(value)
    })
  }
)



