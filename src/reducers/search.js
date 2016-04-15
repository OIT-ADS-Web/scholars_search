//http://spapas.github.io/2016/03/02/react-redux-tutorial/#components-notification-js

import {
  REQUEST_ORGS, RECEIVE_ORGS
} from '../actions/search';

// FIXME: seems like this should be part of search state .. not 'orgs'
// but 'start' as a parameter doesn't really apply
//
function orgReducer(orgs = { isLoading: false, organizations: []}, action) {
 
  switch (action.type) {
    case REQUEST_ORGS:
      return { ...orgs,
        isLoading: true,
        organizations: action.organizations
    }
    case RECEIVE_ORGS:
      return { ...orgs,
        isLoading: false,
        organizations: action.organizations
    }
    default:
      return orgs;
    }

}

import {
  REQUEST_SEARCH, RECEIVE_SEARCH, NEXT_PAGE, PREVIOUS_PAGE, RESET_PAGE, PAGE_ROWS
} from '../actions/search';


/* FIXME: 
 * will need to sort at some point
 *

function sort(search, action) {
  switch (action.type) {
  case SORT:
    return { ...search,
       sort_order: ...?? 
    }
  }
}
*/

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

import { SET_FILTER } from '../actions/search'

/*
function filterReducer(search = {}, action) {
   switch (action.type) {
    case SET_FILTER:
      return action.filter
    default:
      return search
    }
}
*/

// could call it search, just called it searchReducer to be explicit about the key name
// in the combineReducers method
// put filter up here?   as a new parameter?  or like tab changing below?
function searchReducer(search = { isFetching: false, results: {}, start: 0, filter: null }, action) {
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

//
//const CHANGE_SELECTED_TAB = 'CHANGE_SELECTED_TAB';
//
//function changeSelectedTab(selectedTab, tabNamespace) {
//    return {
//        type: CHANGE_SELECTED_TAB,
//        tab: selectedTab,
//        namespace: tabNamespace
//    };
//}

// function tabReducer(state, action) {
//
// switch(action.type) {
//   case SWITCH_TAB_START:
//     return { ...state, tab: null}
//   case SWITCH_TAB_END:
//     return { ...state, tab: action.tab}
//   default:
//     return ...
//  }
// }

import { combineReducers } from 'redux'
import { routerReducer  } from 'react-router-redux'

// FIXME: tabs as different reducers?
// peopleSearch
// publicationSearch
// will get into that later - just need advanced search first
// just naming 'search' to be explicit, not necessary


const mainReducer = combineReducers({
  orgs: orgReducer,
  search: searchReducer,
  routing: routerReducer,
  init: appInitReducer/*,*/
  //filter: filterReducer
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

