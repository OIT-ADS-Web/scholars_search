//http://spapas.github.io/2016/03/02/react-redux-tutorial/#components-notification-js

import { APP_INIT_BEGIN, APP_INIT_END } from '../actions/search'

function appInitReducer(init = {isLoading: false, departments: []}, action) {

  switch(action.type) {
    case APP_INIT_BEGIN:
      return { ...init,
        isLoading: true,
        departments: action.departments
    }
    case APP_INIT_END:
      return { ...init,
        isLoading: false,
        departments: action.departments
    }
    default:
      return init
    }
}

import { REQUEST_TABCOUNTS, RECEIVE_TABCOUNTS } from '../actions/search';


// an action [action.grouped, action.searchFields] is the result of 
// a dispatch() call - the reducers (such as below) change the
// global state based on the action call results

function tabReducer(tabs = {isFetching: false, grouped: {}}, action) {

  switch (action.type) {
 
    case REQUEST_TABCOUNTS:

      return { ...tabs, 
        isFetching: true,
        grouped: action.grouped,
        searchFields: action.searchFields
    }
    case RECEIVE_TABCOUNTS:

      return { ...tabs, 
        isFetching: false,
        grouped: action.grouped,
        lastUpdated: action.receivedAt
    }
    default:
      return tabs;
  }
}


import {
  REQUEST_SEARCH, RECEIVE_SEARCH, NEXT_PAGE, PREVIOUS_PAGE, RESET_PAGE, PAGE_ROWS
} from '../actions/search';


import { SET_FILTER } from '../actions/search'

// initialSearch = {
//  isFetching: false,
//  results: {},
//  start: 0,
//  filter: null
// }
// could call it search, just called it searchReducer to be explicit about the key name
// in the combineReducers method
// put filter up here?   as a new parameter?  or like tab changing below?
// 
// FIXME: grouped is showing up in 'results' - so maybe 'grouped' is not necessary
//
function searchReducer(search = { isFetching: false, results: {}, start: 0, filter: null}, action) {
  switch (action.type) {

  case REQUEST_SEARCH:
    return { ...search, 
      isFetching: true,
      results: action.results,
      searchFields: action.searchFields
    }
  case RECEIVE_SEARCH:
    return { ...search, 
      isFetching: false,
      results: action.results,
      lastUpdated: action.receivedAt
    }
  case NEXT_PAGE:
    return { ...search, 
      start: search.start + PAGE_ROWS
    }
  case PREVIOUS_PAGE:
    return { ...search, 
      start: search.start - PAGE_ROWS
  }
  case RESET_PAGE:
    return { ...search, 
      start: 0 
  }
  case SET_FILTER:
    return { ...search, 
      filter: action.filter
  }
  default:
    return search;
  }
}

import { combineReducers } from 'redux'
import { routerReducer  } from 'react-router-redux'

// FIXME: tabs as different reducers?
// peopleSearch
// publicationSearch
// will get into that later - just need advanced search first
// just naming 'search' to be explicit, not necessary

// NOTE: each reducer combines to effect the global state,
// but only the named one - so, in effect, it's like
// a set of named states within the global state
// e.g. state = {'search': .., 'routing': .. 'init': .. }
//
const mainReducer = combineReducers({
  search: searchReducer,
  routing: routerReducer,
  init: appInitReducer,
  tabs: tabReducer
});

export default mainReducer;

/*
const exampleReducer = combineReducers({
  //orgs: orgReducer,
  search: searchReducer,
  filter: filterReducer,
  //routing: routerReducer,
  //init: appInitReducer
});

export exampleReducer

*/


// FIXME: could make a reducers/main.js that merely combines them
// sort of like this (depending on how many reducers we end up with):
// tried it and didn't work, but probably just forgot something
//
// import { combineReducers } from 'redux'
//import { routerReducer  } from 'react-router-redux'
//
//
//import { orgReducer, searchReducer } from './search'
//
//const mainReducer = combineReducers({
//  orgs: orgReducer,
//  search: searchReducer,
//  routing: routerReducer
//});

//export default mainReducer;

