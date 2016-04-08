
// Example of searching using the SolrQuery class
//
// run via babel-node examples/example_search.js (must npm install babel-cli --global)
//
//
import solr from '../src/utils/SolrQuery'

const solr_url = "http://localhost/ROOTsolr/collection1/select"

let searcher = new solr.SolrQuery(solr_url)
 
searcher.options = {
  wt: "json",
  rows: 20,
  hl: true,
  start: 0
}

// NOTE: can also set filters by type 
//
//solr.setFilter("type","classgroup:*people")

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
  

  
