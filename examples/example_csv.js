// NOTE: need .env file at root to get SOLR_URL
require('dotenv').config();

// Example of searching using the SolrQuery class
//
// run via babel-node examples/example_search.js (must npm install babel-cli --global)
import SolrQuery from '../src/utils/SolrQuery'

import solr from '../src/utils/SolrHelpers'

import json2csv from 'json2csv'

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

//  json2csv({ data: myData, fields: fields }, function(err, csv) {
//  if (err) console.log(err);
//  console.log(csv);
//  });

function printResults(json) {

  let data = json.response.docs
  console.log(data)

  json2csv({data: data, flatten: true}, function(err, csv) {
    if (err) {
      console.log(err)
    }
    else {
      console.log(csv)
    }
  })

}

searcher.execute().then(function(response) {
    return response.json()
}).then(function(json) {
    printResults(json)
})


