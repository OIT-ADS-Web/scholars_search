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
  rows: 0,
  hl: true,
  start: 0
}

const compoundSearch = {
    'allWords': 'medicine',
}
// NOTE: empty ones have to be defined (for now)
// should allow them to be empty though
//
/*
const compoundSearch = {
    'allWords': 'medicine',
    'exactMatch': '',
    'atLeastOne': '',
    'noMatch': ''
}
*/


// NOTE: just like above - except for making a URL like so:
//  ...&group=true&group.query=type:(*Concept)&group.query=type:(*Publication)

searcher.addGroupQuery("type-concept", "type:(*Concept)")
searcher.addGroupQuery("type-publication", "type:(*Publication)")

const qry = searcher.buildQuery(compoundSearch)

searcher.query = qry

console.log(`query: ${qry}`)

const queryString = searcher.queryString


console.log(`queryString: ${queryString}`)

  function printResults(json) {
  console.log("***GETTING RESULTS****")
  console.log(json)
}

searcher.execute().then(function(response) {
    return response.json()
}).then(function(json) {
    //printResults(json)
    const parser = new solr.SolrResultsParser()
    const groupSummary = parser.parseGroups(json.grouped)
    console.log(groupSummary)

})
 
