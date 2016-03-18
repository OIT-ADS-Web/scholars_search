import { combineReducers } from 'redux'
import { routerReducer  } from 'react-router-redux'
//import searchFunction from './do_search'

//export default combineReducers({
  //displayMessage,
//  routing: routerReducer
//})

//import { PAGE_ROWS } from './solr';

// note: object spread operator
// http://redux.js.org/docs/recipes/UsingObjectSpreadOperator.html
 

import {
  REQUEST_SEARCH, RECEIVE_SEARCH, NEXT_PAGE, PAGE_ROWS
} from './actions';

function search(search = { isFetching: false, results: {}, start: 0 }, action) {
  switch (action.type) {
  case REQUEST_SEARCH:
    return { ...state, 
      isFetching: true,
      results: action.results,
      query: action.query
    }
  case RECEIVE_SEARCH:
    return { ...state, 
      isFetching: false,
      results: action.results,
      lastUpdated: action.receivedAt
    }
  case NEXT_PAGE:
    return { ...state, 
      start: state.start + PAGE_ROWS
    }
  default:
    return state;
  }
}

const searchReducer = combineReducers({
  search,
  routing: routerReducer
});

export default searchReducer;
