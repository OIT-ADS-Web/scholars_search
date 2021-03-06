//http://spapas.github.io/2016/03/02/react-redux-tutorial/#components-notification-js

import * as types from '../actions/types'

// an action [action.grouped, action.searchFields] is the result of 
// a dispatch() call - the reducers (such as below) change the
// global state based on the action call results
function tabReducer(tabs = {isFetching: false, grouped: {}}, action) {

  switch (action.type) {
 
  case types.REQUEST_TABCOUNTS:

    return { ...tabs, 
      isFetching: true,
      grouped: action.grouped,
      searchFields: action.searchFields,
      tabList: action.tabList,
      lastUpdated: action.requestedAt
  }
  case types.RECEIVE_TABCOUNTS:

    return { ...tabs, 
      isFetching: false,
      grouped: action.grouped,
      lastUpdated: action.receivedAt
  }
  case types.TABCOUNTS_FAILED:
    
    return { ...tabs,
       isFetching: false,
       message: action.message,
       lastUpdated: action.failedAt
  }
  default:
    return tabs;
  }
}


// could call it #search, just called it #searchReducer to be explicit about the key name
// in the combineReducers method
function searchReducer(search = { isFetching: false, results: {}}, action) {
  switch (action.type) {

  case types.REQUEST_SEARCH:
    
    return { ...search, 
      isFetching: true,
      results: action.results,
      searchFields: action.searchFields,
      filterer: action.filterer,
      lastUpdated: action.requestedAt
  }
  case types.RECEIVE_SEARCH:
    
    return { ...search, 
      isFetching: false,
      results: action.results,
      lastUpdated: action.receivedAt
  }
  case types.EMPTY_SEARCH:
    return { ...search,
      isFetching: false,
      searchFields: {}, // NOTE: need to empty out so it doesn't repopulate search fields 
      results: action.results
  }
  case types.SEARCH_FAILED:
    
    return { ...search,
      isFetching: false,
      message: action.message,
      lastUpdated: action.failedAt
  }
  default:
    return search;
  }
}


function initReducer(init = { isFetching: false, departments: {}}, action) {
  switch (action.type) {

  case types.REQUEST_DEPARTMENTS:
    
    return { ...init, 
      isFetching: true,
      departments: action.departments
  }
  case types.RECEIVE_DEPARTMENTS:
    
    return { ...init, 
      isFetching: false,
      departments: action.departments
  }
  case types.DEPARTMENTS_FAILED:
    
    return { ...init,
      isFetching: false,
      message: action.message
  }
  default:
    return init
  }
}

function facetsReducer(facets = { showFacets: false}, action) {
  switch (action.type) {
  
  case types.FACETS_TOGGLE:
    let shown = facets.showFacets
    return { ... facets, showFacets: !shown }
  case types.FACETS_HIDE:
    return { ... facets, showFacets: false }
  default:
    return facets
  }
}



import { combineReducers } from 'redux'
import { routerReducer  } from 'react-router-redux'

// NOTE: each reducer combines to effect the global state,
// but only the named one - so, in effect, it's like
// a set of named sub-states within the global state
// e.g. state = {'search': .., 'routing': .. 'init': .. }
// it's not necessary to explicitly set the key like this,
// as it will default to the name of the function.  I just
// did it to be obvious
const mainReducer = combineReducers({
  search: searchReducer,
  routing: routerReducer,
  tabs: tabReducer,
  init: initReducer,
  facets: facetsReducer
})

export default {
  mainReducer,
  searchReducer
}


