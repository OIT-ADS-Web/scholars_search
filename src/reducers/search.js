import { combineReducers } from 'redux'
import { routerReducer  } from 'react-router-redux'

import {
  REQUEST_SEARCH, RECEIVE_SEARCH, NEXT_PAGE, PAGE_ROWS
} from '../actions/search';


//http://spapas.github.io/2016/03/02/react-redux-tutorial/#components-notification-js


/*
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

function search(search = { isFetching: false, results: {}, start: 0 }, action) {
  switch (action.type) {
  case REQUEST_SEARCH:
    return { ...search, 
      isFetching: true,
      results: action.results,
      query: action.query
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
// import init from './init'  ????
//
//
const searchReducer = combineReducers({
  search: search,
  routing: routerReducer
});

export default searchReducer;
