import {
  REQUEST_ORGS, RECEIVE_ORGS
} from '../actions/search';


function init(search, action) {

  switch (action.type) {
    case REQUEST_ORGS:
      return { ...search,
        isFetching: true,
        orgs: action.orgs
    }
    case RECEIVE_ORGS:
      return { ...search,
        isFetching: false,
        orgs: action.orgs
    }
    default:
      return search;
    }

}



