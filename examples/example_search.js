// NOTE: need .env file at root to get SOLR_URL
require('dotenv').config();

// Example of searching using the SolrQuery class
//
// run via babel-node examples/example_search.js (must npm install babel-cli --global)
import SolrQuery from '../src/utils/SolrQuery'

import solr from '../src/utils/SolrHelpers'

const solr_url = process.env.SOLR_URL

let searcher = new SolrQuery(solr_url)
 
searcher.options = {
  wt: "json",
  rows: 20,
  hl: true,
  start: 0
}

const compoundSearch = {
    'allWords': 'medicine'
}

const qry = searcher.buildQuery(compoundSearch)
searcher.query = qry

console.log(`query: ${qry}`)

function printResults(json) {
  console.log("***GETTING RESULTS****")
  console.log(json)
}

searcher.execute().then(function(response) {
  return response.json()
}).then(function(json) {
  printResults(json)
})

// NOTE: it's random which one returns first
const compoundSearch2 = {
  'allWords': 'alejandro'
}


// adding a filter now - 
const qry2 = searcher.buildQuery(compoundSearch2)
searcher.query = qry2

const tabs = solr.tabList 
console.log(tabs)

const filterStr = tabs[0].filter
console.log("adding filter..."+ filterStr)
if (filterStr) {
  searcher.addFilter("type", filterStr)
}

// then run again
searcher.execute().then(function(response) {
  return response.json()
}).then(function(json) {
  printResults(json)
})
  
// NOTE: can remove a filter too via
// deleteFilter("type")  {
 
