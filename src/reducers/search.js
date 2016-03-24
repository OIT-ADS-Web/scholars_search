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
  REQUEST_SEARCH, RECEIVE_SEARCH, NEXT_PAGE, PAGE_ROWS
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


// could call it search, just called it searchReducer to be explicit about the key name
// in the combineReducers method
//
function searchReducer(search = { isFetching: false, results: {}, start: 0 }, action) {
  switch (action.type) {
  case REQUEST_SEARCH:
    return { ...search, 
      isFetching: true,
      results: action.results,
      //query: action.query
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
  default:
    return search;
  }
}


// FIXME: tabs as different reducers?
// peopleSearch
// publicationSearch
// will get into that later - just need advanced search first
// just naming 'search' to be explicit, not necessary
//
//
//
//export default {
//  orgReducer,
//  searchReducer
//
//} 

import { combineReducers } from 'redux'
import { routerReducer  } from 'react-router-redux'


const mainReducer = combineReducers({
  orgs: orgReducer,
  search: searchReducer,
  routing: routerReducer
});

export default mainReducer;

