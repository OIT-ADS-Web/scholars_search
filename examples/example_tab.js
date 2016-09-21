require('dotenv').config();

import SolrQuery from '../src/utils/SolrQuery'

import solr from '../src/utils/SolrHelpers'

const solrUrl = process.env.SOLR_URL

let searcher = new SolrQuery(solrUrl)
 
const compoundSearch = {
    'allWords': 'med*'
}

const qry = searcher.buildQuery(compoundSearch)
searcher.query = qry

// need to do this for fmt=json and stuff like that
solr.setupDefaultSearch(searcher)

class SearchResults {

  constructor(results) {
    // NOTE: this is sort of a mock of a component with props
    const { highlighting={}, response={}, facet_counts={} } = results
    const { numFound=0,docs } = response
    const { facet_queries, facet_fields } = facet_counts
     
    this.highlighting = highlighting
    this.response = response
    this.facet_counts = facet_counts
    this.numFound = numFound
    this.docs = docs
    this.facet_queries = facet_queries
    this.facet_fields = facet_fields

  }

}

class TabDisplay {
 
  results(docs, highlighting) {
    let resultSet = docs.map(doc => { 
        let highlight = highlighting[doc.DocId]
        return this.individualDisplay(doc, highlight)
    })
    return resultSet
  }

  individualDisplay(doc, highlight) { }
  facetsDisplay(facet_counts) {}

}

class TabFilterer {
  applyFilters(searcher) {}
}

class PersonDisplay extends TabDisplay {

  individualDisplay(doc, highlight) {
    return "->" + doc.URI
  }

 facetDisplay(facet_counts) {
   //console.log(facet_counts.facet_fields.department_facet_string)
   let ary = facet_counts.facet_fields['department_facet_string']
   return ary
 }

}

class PeopleFilterer extends TabFilterer {

  applyFilters(searcher) {
    searcher.addFilter("type", "type:(*Person)")
    searcher.setFacetField("department_facet_string", {prefix: "1|",  missing: "true"})
  }

}

// NOTE: this is just an example of the tabs in a conceptually simplied
// form i.e. there is a displayer and a filterer
//
class PeopleTab {

  get filterer() {
    return new PeopleFilterer()
  }

  get displayer() {
    return new PersonDisplay()
  }

}

let tab = new PeopleTab()
let filterer = tab.filterer

filterer.applyFilters(searcher)

function printResults(json) {
  console.log("printResults")
  let results =  new SearchResults(json)
  let tab = new PeopleTab()
  let displayer = tab.displayer

  let html = displayer.results(results.docs, results.highlighting)

  console.log(html)
  
  let facets = displayer.facets(results.facet_counts)
  console.log(facets)

}

searcher.execute().then(function(response) {
  return response.json()
}).then(function(json) {
  printResults(json)
})



