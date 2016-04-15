require('dotenv').config();

import configureStore, { configureStoreWithoutLogger } from '../src/configureStore'

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

//import APP_INIT from '../src/actions/search'
//Store.dispatch({type: 'APP_INIT', departments: []});


// from tutorial - use to test
//
//
//import { createStore } from 'redux'
//import todoApp from './reducers'
//let store = createStore(todoApp)

//console.log(store.getState())
//store.dispatch(addTodo('Learn about actions'))
//store.dispatch(addTodo('Learn about reducers'))
//store.dispatch(addTodo('Learn about store'))
//store.dispatch(completeTodo(0))
//store.dispatch(completeTodo(1))
//store.dispatch(setVisibilityFilter(VisibilityFilters.SHOW_COMPLETED))

