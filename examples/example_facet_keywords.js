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
  //'exactMatch': 'medicine'
  'allWords': 'med*'
}

import { tabList } from '../src/tabs'

searcher.addFilter("type", "type:(*Concept)")

const qry = searcher.buildQuery(compoundSearch)
searcher.query = qry

console.log(`query: ${qry}`)

//searcher.setFacetQuery(`nameText:${qry}`, {missing: "true"})
//searcher.setFacetQuery(`ALLTEXT:${qry}`, {missing: "true"})

searcher.setFacetQuery(`{!ex=match}nameText:${qry}`)
searcher.setFacetQuery(`{!ex=match}ALLTEXT:${qry}`)

//searcher.setFacetQuery("{!field f=nameText v=$q}")
//searcher.setFacetQuery("{!field f=ALLTEXT v=$q}")

//searcher.setFacetField(`{!ex=dt}nameText`)

//Filter exclusion is supported for all types of facets. Both the tag and ex local params may specify multiple values by separating them with commas. 

// NOTE: have to give name ... 'match'

// ideally we'd NOT add {!ex=match} to facet queries unless there is this filter
// but it seems to ignore anyway
//
searcher.addFilter("match", `{!tag=match}nameText:${qry}`)

//q=mainquery&fq=status:public&fq={!tag=dt}doctype:pdf&facet=on&facet.field={!ex=dt}doctype

//&fq=price:[400 to 500]
//https://lucidworks.com/blog/2009/09/02/faceted-search-with-solr/

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

