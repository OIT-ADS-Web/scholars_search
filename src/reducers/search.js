import { combineReducers } from 'redux'
import { routerReducer  } from 'react-router-redux'


import {
  REQUEST_SEARCH, RECEIVE_SEARCH, NEXT_PAGE, PAGE_ROWS
} from '../actions/search';

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
    return search;
  }
}

const searchReducer = combineReducers({
  search,
  routing: routerReducer
});

export default searchReducer;
