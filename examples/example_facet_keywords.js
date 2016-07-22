// NOTE: need .env file at root to get SOLR_URL
require('dotenv').config();

// Example of searching using the SolrQuery class
//
// run via babel-node examples/example_search.js (must npm install babel-cli --global)
import SolrQuery from '../src/utils/SolrQuery'

import solr from '../src/utils/SolrHelpers'

const solrUrl = process.env.SOLR_URL

let searcher = new SolrQuery(solrUrl)

searcher.options = {
  wt: "json",
  rows: 20,
  hl: true,
  start: 0
}

const compoundSearch = {
  'exactMatch': 'medicine'
  //'allWords': 'med*'
}

import { tabList } from '../src/tabs'

searcher.addFilter("type", "type:(*Concept)")

const qry = searcher.buildQuery(compoundSearch)
searcher.query = qry

console.log(`query: ${qry}`)

// facet.query=`label:${qry}`
//searcher.setFacetQuery(`nameText:${qry}`, {missing: "true"})
//searcher.setFacetQuery(`ALLTEXT:${qry}`, {missing: "true"})
//searcher.setFacetQuery(`nameText:${qry}`)
//searcher.setFacetQuery(`ALLTEXT:${qry}`)

searcher.setFacetQuery("{!field f=nameText v=$q}")
searcher.setFacetQuery("{!field f=ALLTEXT v=$q}")


//localparams ???
//{!term f=author v=$author}


function printResults(json) {
  console.log("***GETTING RESULTS****")
  console.log(json)

  //console.log(json.facet_counts.facet_fields['department_facet_string'])
}

searcher.execute().then(function(response) {
  return response.json()
}).then(function(json) {
  printResults(json)
})

