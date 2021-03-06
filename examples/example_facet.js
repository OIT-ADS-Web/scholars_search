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

const solrUrl = process.env.SOLR_URL

let searcher = new SolrQuery(solrUrl)

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

searcher.setFacetField("department_facet_string", {prefix: "1|",  missing: "true"})

//searcher.setFacetField("department_search_text", {mincount: "1"})

searcher.setFacetField("department_name_facet_string", {mincount: "1"})



import { tabList } from '../src/components/tabs/TabLoader'

// should be 'people' tab filter
const filterStr = tabList[0].filter
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

  //console.log(json.facet_counts.facet_fields['department_search_text'])
  console.log(json.facet_counts.facet_fields['department_name_facet_string'])


}

searcher.execute().then(function(response) {
  return response.json()
}).then(function(json) {
  printResults(json)
})

