import fetch from 'isomorphic-fetch'
//import { Solr } from './solr'

export const REQUEST_SEARCH  = 'REQUEST_SEARCH';
export const RECEIVE_SEARCH  = 'RECEIVE_SEARCH';
export const NEXT_PAGE       = 'NEXT_PAGE';
export const PAGE_ROWS   = 50;

function requestSearch(query) {
  return {
    type: REQUEST_SEARCH,
    results: {docs: []},
    query
   }
}

function receiveSearch(json) {
  return {
    type: RECEIVE_SEARCH,
    results: json.response,
    receivedAt: Date.now()
  }
}

export function nextPage() {
  return {
    type: NEXT_PAGE
  }
}


export function fetchSearch(query='*:*', start=0) {
  return dispatch => {
    dispatch(requestSearch(query));
    
    //let s = new Solr({query, start});
    //let uri = s.build();
    //console.log(`uri: ${uri}`);
    //return fetch(uri)
    //  .then(response => response.json())
    //  .then(json => dispatch(receiveSearch(json)))
  }
}



