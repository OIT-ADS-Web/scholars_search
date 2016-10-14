// NOTE: need .env file at root to get SOLR_URL
require('dotenv').config();

// Example of fetching deparment list
//
// run via babel-node examples/example_departments.js (must npm install babel-cli --global)

import { fetchDepartmentsApi } from '../src/actions/sagas'

/*
 * NOTE: will look like this:
 * [
    {
      "name": "Duke University",
      "PARENT_URI": "",
      "URI": "https://scholars.duke.edu/individual/org50000021"
    },
    {
      "name": "School of Law",
      ...
    }
  }
*/

function printResults(json) {
  console.log("***GETTING RESULTS****")
  console.log(json)
}


fetchDepartmentsApi().then(function(json) {
  printResults(json)
})



