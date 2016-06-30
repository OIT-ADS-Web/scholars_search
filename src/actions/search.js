import * as types from './types'

// ******* search *******
export function requestSearch(searchFields) {
  return {
    type: types.REQUEST_SEARCH,
    results: {responseHeader: {}, response: {}, highlighting: {}},
    isFetching: true,
    searchFields: searchFields
  }
}

export function receiveSearch(json) {
  return {
    type: types.RECEIVE_SEARCH,
    results: json,
    isFetching: false,
    receivedAt: Date.now()
  }
}

export function cancelSearch() {
  return {
    type: types.SEARCH_CANCELLED
  }
}

export function searchFailed(message) {
  return {
    type: types.SEARCH_FAILED,
    message: message
  }
}

// ****** tabs *******
export function requestTabCount(searchFields) {
  return {
    type: types.REQUEST_TABCOUNTS,
    grouped: {},
    isFetching: true,
    searchFields: searchFields
  }

}

export function receiveTabCount(json) {
  let grouped = json.grouped

  return {
    type: types.RECEIVE_TABCOUNTS,
    grouped: grouped,
    isFetching: false,
    receivedAt: Date.now()
  }

}

export function tabCountFailed(message) {
  return {
    type: types.TABCOUNTS_FAILED,
    message: message
  }
}


// allow all to be exported at once into an 'actions' object
export default {
  requestSearch,
  receiveSearch,
  cancelSearch,
  searchFailed,
  requestTabCount,
  receiveTabCount,
  tabCountFailed
} 

