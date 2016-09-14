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

// FIXME: not crazy about this api - the local param has to match the facet field name
// exactly to work - seems like they should both be added at the same time -- mabye something like this:
//
// searcher.setFacetField("department_facet_string", {prefix: "1|", mincount: "1"}, "{!ex=dept}")
searcher.setFacetLocalParam("department_facet_string", "{!ex=dept}")

// http://shalinsays.blogspot.com/2009/04/tagging-and-excluding-filters.html
// http://yonik.com/multi-select-faceting/

let filter = "{!tag=dept}department_facet_string:1|*individual/org50000761"
searcher.addFilter("dept", filter)

searcher.setFacetField("mostSpecificTypeURIs", {mincount: "1"})
searcher.setFacetLocalParam("mostSpecificTypeURIs", "{!ex=type}")

// FIXME: another problem with api - the {!tag=?} needs to be unique - so have to keep
// track of that - to be consistent could even use searcher.setFacetLocalParam() somehow
// for both filter and facet non exclusion
//

let filter2 = "{!tag=type}mostSpecificTypeURIs:(*FacultyMember)"
searcher.addFilter("positionType", filter2)


import _ from 'lodash'

function printResults(json) {
  console.log("***GETTING RESULTS****")
  console.log(json)

  //console.log(json.responseHeader.params)
  //let facet_field = json.responseHeader.params["facet.field"]
  //console.log("facet.field="+facet_field)

  let facet_fields = json.facet_counts.facet_fields

  let results = {}
  _.forEach(facet_fields, function(value, key) {
    results[key] = []
    
    let array = value
    let size = array.length
    let i = 0
    // strangely results are array, of [<count><field>, <count><field> ... ]
    while (i < size) {
      let label = array[i]
      let count = array[i+1]
      let summary = {label: label, count:count}
      results[key].push(summary)
      i = i + 2
    }
  })

  console.log("******RESULTS *******")

  // FIXME: this isn't sorted in any particular way
  console.log(results)
}

searcher.execute().then(function(response) {
  return response.json()
}).then(function(json) {
  printResults(json)
})



