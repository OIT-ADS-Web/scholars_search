// NOTE: need .env file at root to get SOLR_URL
require('dotenv').config();

// Example of searching using the SolrQuery class
//
// run via babel-node examples/example_search.js (must npm install babel-cli --global)
import solr from '../src/utils/SolrQuery'

const solr_url = process.env.SOLR_URL

let searcher = new solr.SolrQuery(solr_url)
 
searcher.options = {
  wt: "json",
  rows: 20,
  hl: true,
  start: 0
}

const compoundSearch = {
    'allWords': 'medicine',
    'exactMatch': '',
    'atLeastOne': '',
    'noMatch': ''
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
    'allWords': 'alejandro',
    'exactMatch': '',
    'atLeastOne': '',
    'noMatch': ''
}

const qry2 = searcher.buildQuery(compoundSearch2)
searcher.query = qry2

// NOTE: can also add filters by type 
// might be better terms "addFilter"
searcher.addFilter("type", "classgroup:*people")

// then run again
searcher.execute().then(function(response) {
    return response.json()
}).then(function(json) {
    printResults(json)
})
  

// NOTE: can remove a filter too via
// deleteFilter("type")  {
 
