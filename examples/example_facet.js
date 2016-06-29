// NOTE: need .env file at root to get SOLR_URL
require('dotenv').config();

/*
  "department_facet_string": [
    "4|https://scholars.duke.edu/individual/org50000761|https://scholars.duke.edu/individual/org50000829|https://scholars.duke.edu/individual/org50000844|https://scholars.duke.edu/individual/org50761842",
    "3|https://scholars.duke.edu/individual/org50000761|https://scholars.duke.edu/individual/org50000829|https://scholars.duke.edu/individual/org50000844",
    "2|https://scholars.duke.edu/individual/org50000761|https://scholars.duke.edu/individual/org50000829",
    "1|https://scholars.duke.edu/individual/org50000761"
  ],
*
*/

// Example of searching using the SolrQuery class
//
// run via babel-node examples/example_search.js (must npm install babel-cli --global)
import SolrQuery from '../src/utils/SolrQuery'

import solr from '../src/utils/SolrHelpers'

const solr_url = process.env.SOLR_URL

let searcher = new SolrQuery(solr_url)

// facet: true
// facet.field = department_facet_string  
searcher.options = {
  wt: "json",
  rows: 20,
  hl: true,
  start: 0
}

const compoundSearch = {
    'allWords': 'medicine'
}

    // example from Jim's original person search
    //}).setFilter("type","classgroup:*people").setFacetField("department_facet_string",{
    //  prefix: "1|",
    //  mincount: "1"
    //})

searcher.setFacetField("department_facet_string", {prefix: "1|",  missing: "true"})

const tabs = solr.tabList 

// should be 'people' tab filter
const filterStr = tabs[0].filter
//console.log("adding filter..."+ filterStr)
if (filterStr) {
  searcher.addFilter("type", filterStr)
}


const qry = searcher.buildQuery(compoundSearch)
searcher.query = qry

console.log(`query: ${qry}`)

function printResults(json) {
  console.log("***GETTING RESULTS****")
  console.log(json)
  console.log(json.facet_counts.facet_fields['department_facet_string'])
}

searcher.execute().then(function(response) {
    return response.json()
}).then(function(json) {
    printResults(json)
})

