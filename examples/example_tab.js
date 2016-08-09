require('dotenv').config();

import SolrQuery from '../src/utils/SolrQuery'

import solr from '../src/utils/SolrHelpers'

const solrUrl = process.env.SOLR_URL

let searcher = new SolrQuery(solrUrl)
 
//import PeopleTab from '../src/components/PeopleTab'

//class AbstractSearchFilter
/*
class SearchFilter {
    
    constructor(searcher) {
      this.searcher = searcher
      this.init()
    }

    init() {
      this.addFilter()
      this.addFacets()
  }

}
*/

const compoundSearch = {
    'allWords': 'med*'
}

const qry = searcher.buildQuery(compoundSearch)
searcher.query = qry

// need to do this for fmt=json and stuff like that
solr.setupDefaultSearch(searcher)

class SearchResults {

  constructor(results) {
    let { highlighting={}, response={}, facet_counts={} } = results
    let { numFound=0,docs } = response
    let { facet_queries, facet_fields } = facet_counts
     
    this.highlighting = highlighting
    this.response = response
    this.facet_counts = facet_counts
    this.numFound = numFound
    this.docs = docs
    this.facet_queries = facet_queries
    this.facet_fields = facet_fields

  }

}

class Tab {

  pickDisplay(doc, highlight) {
    return doc.URI
  }

  results(docs, highlighting) {
    let resultSet = docs.map(doc => { 
        let highlight = highlighting[doc.DocId]
        return this.pickDisplay(doc, highlight)
    })
    return resultSet
  }

  
}


class PeopleTab extends Tab {

  pickDisplay(doc, highlight) {
    return doc.URI
  }

  applyFilters(searcher) {
    searcher.addFilter("type", "type:(*Person)")
    searcher.setFacetField("department_facet_string", {prefix: "1|",  missing: "true"})
  }

 // parseFacetCounts(facet_counts) {
 //
 // } 
 //
 //
 facets(facet_counts) {
   //console.log(facet_counts.facet_fields.department_facet_string)
   let ary = facet_counts.facet_fields['department_facet_string']
   return ary
 }

}

let tab = new PeopleTab()
tab.applyFilters(searcher)


function printResults(json) {
  let results =  new SearchResults(json)
  let display = new PeopleTab()
  
  let html = display.results(results.docs, results.highlighting)

  console.log(html)

  let facets = display.facets(results.facet_counts)
  console.log(facets)

}

searcher.execute().then(function(response) {
  return response.json()
}).then(function(json) {
  printResults(json)
})


//searcher.addFilter("type", "type:(*Person)")

//const qry = searcher.buildQuery(compoundSearch)
//searcher.query = qry

//console.log(`query: ${qry}`)

// ? prefix --
//searcher.setFacetField("department_facet_string", {prefix: "1|",  missing: "true"})


// searcher
// displayer
//
//
//
//
// init(searcher)
// .addFilter
// .setFacetField()
// ...
//  AbstractTab() {
//
//    constructor(searcher) {
//      this.searcher = searcher
//      this.init()
//    }
//
//    init() {
//      this.addFilter()
//      this.addFacets()
//  }
//
//  PersonTab() {
//   
//   constructor(searcher) {
//     this.searcher = searcher
//   }
//
//   filter() {
//     this.searcher.addFilter("type", "type:(*Person)")
//   }
//
//   addFacets() {
//     this.searcher.setFacetField("department_facet_string", {prefix: "1|",  missing: "true"})
//   
//    let qry = searcher.query
//
//    searcher.setFacetQuery(`{!ex=match}nameText:${qry}`)
//    searcher.setFacetQuery(`{!ex=match}ALLTEXT:${qry}`)

// }
// 
// PersonDisplay() {
//
// }
//
// PersonTabDisplay() {
//
//
//    constructor(results) {
//      let { highlighting={}, response={}, facet_counts={} } = results
//      let { numFound=0,docs } = response
//      let { facet_queries, facet_fields } = facet_counts
//     
//      this.highlighting = highlighting
//      this.response = response
//      this.facet_counts = facet_counts
//      this.numFound = numFound
//      this.docs = docs
//      this.facet_queries = facet_queries
//      this.facet_fields = facet_fields
//
//    }
//
//    facetQueries() {
//
//    }
//
//    facetFields() {
//
//    }
//
// }
