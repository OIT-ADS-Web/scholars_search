import * as types from './types'

export function requestSearch(searchFields, filterer) {
  return {
    type: types.REQUEST_SEARCH,
    results: {responseHeader: {}, response: {}, highlighting: {}},
    isFetching: true,
    searchFields: searchFields,
    filterer: filterer,
    requestedAt: Date.now()
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

export function emptySearch() {
  return {
    type: types.EMPTY_SEARCH,
    results: {},
    isFetching: false
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
    message: message,
    failedAt: Date.now()
  }
}

// ****** tabs *******
export function requestTabCount(searchFields, tabList) {
  return {
    type: types.REQUEST_TABCOUNTS,
    grouped: {},
    isFetching: true,
    searchFields: searchFields,
    tabList: tabList,
    requestedAt: Date.now()
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
    message: message,
    failedAt: Date.now()
  }
}

/******** departments ********/
export function requestDepartments() {
  return {
    type: types.REQUEST_DEPARTMENTS,
    data: {},
    isFetching: true,
  }

}

export function receiveDepartments(json) {
  let departments = json

  return {
    type: types.RECEIVE_DEPARTMENTS,
    data: departments,
    isFetching: false
  }

}

export function departmentsFailed(message) {
  return {
    type: types.DEPARTMENTS_FAILED,
    message: message,
    failedAt: Date.now()
  }
}


// allow all to be exported at once into an 'actions' object
export default {
  requestSearch,
  receiveSearch,
  emptySearch,
  cancelSearch,
  searchFailed,
  requestTabCount,
  receiveTabCount,
  tabCountFailed,
  requestDepartments,
  receiveDepartments,
  departmentsFailed
} 

