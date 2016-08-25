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
  'allWords': 'med*'
}

import { tabList } from '../src/components/TabList'

searcher.addFilter("type", "type:(*Person)")

const qry = searcher.buildQuery(compoundSearch)
searcher.query = qry

console.log(`query: ${qry}`)

searcher.setFacetField("department_facet_string", {prefix: "1|", mincount: "1"})

searcher.setFacetLocalParam("department_facet_string", "{!ex=dept}")

// http://shalinsays.blogspot.com/2009/04/tagging-and-excluding-filters.html
// http://yonik.com/multi-select-faceting/

let filter = "{!tag=dept}department_facet_string:1|*individual/org50000761"

searcher.addFilter("dept", filter)

import _ from 'lodash'

function printResults(json) {
  console.log("***GETTING RESULTS****")
  console.log(json)
  let facet_fields = json.facet_counts.facet_fields

  let results = {}
  _.forEach(facet_fields, function(value, key) {
    results[key] = []

    let array = value
    let size = array.length
    let i = 0
    // strangely results are array, of [<count><field>, <count><field> ... ]
    while (i < size) {
      let dept = array[i]
      let count = array[i+1]
      let summary = {dept: dept, count:count}
      results[key].push(summary)
      i = i + 2
    }
  })

  // FIXME: this isn't sorted in any particular way
  console.log(results)
}

searcher.execute().then(function(response) {
  return response.json()
}).then(function(json) {
  printResults(json)
})



