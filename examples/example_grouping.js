// NOTE: need .env file at root to get SOLR_URL
require('dotenv').config();

// Example of grouping using the SolrQuery class
//
// run via babel-node examples/example_search.js (must npm install babel-cli --global)
import solr from '../src/utils/SolrQuery'

const solr_url = process.env.SOLR_URL

let searcher = new solr.SolrQuery(solr_url)
 
searcher.options = {
  wt: "json",
  rows: 0,
  hl: true,
  start: 0,
  group: true
}

const compoundSearch = {
    'allWords': 'medicine',
}

searcher.addGroupQuery("type-person", "type:(*Person)")
searcher.addGroupQuery("type-concept", "type:(*Concept)")
searcher.addGroupQuery("type-publication", "type:(*AcademicArticle)")

const qry = searcher.buildQuery(compoundSearch)

searcher.query = qry

console.log(`query: ${qry}`)

const queryString = searcher.queryString

// NOTE: solr parameters look like this: 
//  ...&group=true&group.query=type:(*Concept)&group.query=type:(*Publication)
console.log(`queryString: ${queryString}`)

function printResults(json) {
  console.log("***GETTING RESULTS****")
  console.log(json)
}

searcher.execute().then(function(response) {
    return response.json()
}).then(function(json) {
    //printResults(json)
    // NOTE: added parser as a possible way to clarify results
    const parser = new solr.SolrResultsParser()
    const groupSummary = parser.parseGroups(json.grouped)
    console.log(groupSummary)

})
 
