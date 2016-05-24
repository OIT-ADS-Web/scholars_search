require('dotenv').config();

import { sagaMiddleware } from  '../src/configureStore'

import { configureStoreWithSaga } from '../src/configureStore'

// NOTE: made this method so I can add 'saga' middleware, but NOT have the logger
const Store = configureStoreWithSaga()

import rootSaga from '../src/actions/sagas'

sagaMiddleware.run(rootSaga)
//Store.runSaga(rootSaga)

const compoundSearch = { 'allWords': 'medicine'}

// NOTE: there is no guaranetee the order these are called or returned
Store.dispatch({type: 'REQUEST_SEARCH', searchFields: compoundSearch})
Store.dispatch({type: 'REQUEST_TABCOUNTS', compoundSearch: compoundSearch})



