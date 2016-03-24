import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
//import searchReducer from './reducers/search'

const loggerMiddleware = createLogger()

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  loggerMiddleware
)(createStore)


//import fetchOrgs from './utils/fetch'

const initialState = {
  //organizations: fetchOrgs()
}


import mainReducer from './reducers/search'
//import mainReducer from './reducers/main'


export default function configureStore(initialState = initialState) {
  return createStoreWithMiddleware(mainReducer, initialState)
}

/*
 
FIXME: here's a beginning place to at least document what the 
potential state in the store would look like:


      this.state = {
      query: "",
      departments: [],
      organizations: [],
      searchResult: {
        response: {
          highlighting: {},
          docs: []
        },
        facet_counts: {
          facet_fields: {
            department_facet_string: []
          }
        }
      }
    }



*/

