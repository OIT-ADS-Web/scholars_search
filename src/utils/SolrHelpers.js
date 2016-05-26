import _ from 'lodash'

function buildComplexQuery(compoundSearch = {}) {
  // NOTE: this method will get an object that looks like this:
  //
  // const compoundSearch = {
  //    'allWords': allWords.value,
  //    'exactMatch': exactMatch.value,
  //    'atLeastOne': atLeastOne.value,
  //    'noMatch': noMatch.value
  // }

  // and constructs a solr query based on this template:
  //
  // all words = ( word AND word .. )   
  // exact match = "word phrase"
  // at least one = ( word OR word ..)
  // no match = NOT (word OR word ..)
  //
  // NOTE: "NOT" that is alone returns no results
  //
  // FIXME: this is also used for display to show the user what the search
  // looks like - that may be ill-advised because it's also the actual
  // query sent to SOLR

  //
  var query = ""
  if (_.isEmpty(compoundSearch)) {
    return query
  }

  // NOTE: was a separate function, but unlikely to call outside
  // of this context
  let gatherStatements = function(words, delimiter) {
    // given an array and a delimiter, join with that delimiter
    // but also group by parenthesis if necessary
    var exp = words.join(delimiter)
    if (exp) {
      if (words.length > 1) {
          // group if more than 1 - just to be unambigous
          exp = "(" + exp + ")"
        }
      }

    return exp 
  }

  // split by "," or <space>
  //
  // allWords => array
  // exactMatch != array
  // atLeastOne => array
  // noMatch => array
  // listing in same order as form
  const allWords = "allWords" in compoundSearch ? compoundSearch.allWords.split(/[ ,]+/) : [] 
  const exactMatch = "exactMatch" in compoundSearch ? compoundSearch.exactMatch : ''
  const atLeastOne = "atLeastOne" in compoundSearch ? compoundSearch.atLeastOne.split(/[ ,]+/) : []
  const noMatch = "noMatch" in compoundSearch ? compoundSearch.noMatch.split(/[ ,]+/) : []

  if (noMatch &&  !(allWords || exactMatch || atLeastOne)) {
     //NOTE:  (can't NOT without something to match to begin with)
     return ''
  }

  var queryArray = []
    
  var allWordsExp = gatherStatements(allWords, " AND ")
  if (allWordsExp) { queryArray.push(allWordsExp) }
    
  if (exactMatch) { queryArray.push("\""+exactMatch+"\"") }

  var atLeastOneExp = gatherStatements(atLeastOne,  " OR ")
  if (atLeastOneExp) { queryArray.push(atLeastOneExp) }

  if (noMatch != false) {
   var noMatchExp = "NOT " + gatherStatements(noMatch, " OR ")
   if (noMatchExp) { queryArray.push(noMatchExp) }
  }

  // take out empty "" entries, just in case made it this far
  // http://stackoverflow.com/questions/281264/remove-empty-elements-from-an-array-in-javascript
  queryArray = queryArray.filter(function() { return true; })
 
  query = queryArray.join(" AND ")

  return query

}

// NOTE: not using this quite yet, except in one
// example script, but the general idea is to allow the UI
// code to not have to know internals of Solr, like
// highlighting, doc.DocId, ALLTEXT etc...
class SolrResultsParser {

  // FIXME: if a constructor falls in the forest but noone hears
  // it, does it exist?  i.e. what does javascript do with
  // empty constructors?
  /*
   constructor() {

   }
  */

   parseResponse(results) {
    /* 
       NOTE: a basic solr query will return stuff looking like this:

     results {
       response": {
        "numFound": 66,
        "start": 0,
        "maxScore": 21.456455,
        "docs": [{ ... }]
      },
      "highlighting": {
          "vitroIndividual:https://scholars.duke.edu/individual/org50000844": {
          "ALLTEXT": [...]
        }
      }
    */
 
     let { highlighting={}, response={} } = results;
     let { numFound=0,docs } = response;
     
     return { numFound: numFound, docs: docs, highlighting: highlighting }
    
   }

   parseGroups(grouped) {

   // NOTE: this is what is received
    /*
     grouped": {
        "type:(*Concept)": {
          "matches": 2891,
          "doclist": {
            "numFound": 1980,
            "start": 0,
            "maxScore": 1,
            "docs": [{ .... }]

    */
     // and this is what we want (in some cases):
     
     /* {
      *  "type:(*Concept)":  1980,
      *  "type:(*Publication)":  0 
      * }
      *
      *  with "type:(*Concept)" leading easily to label: "Subject Headings"
      *  etc... (see filterConfig)
      */

      //let { doclist={} } = grouped;
      var summary = {}
      _.forEach(grouped, function(value, key) {
        summary[key] = value.doclist.numFound
      });

     return summary 
   }


}


// these correspond to tabs
//
// The tabs are these (at the moment):
//
// [People][Publications][Artistic Works][Grants][Subject Headings][Misc]
// disadvantage of this structure - ORDER is possibly random, I'm not sure
//
// FIXME: could put in array to assure order
//
// FIXME: this has solr specific stuff "type:(*Person)" - but is a UI element
// (tabs) so a bit of crossed concerns, but probably shouldn't be in SolrQuery.js
export const tabList = [
  { id: "person", filter: "type:(*Person)", label: "People" },
  { id: "publications",  filter: "type:(*AcademicArticle)", label: "Publications" },
  { id: "organizations",  filter: "type:(*Organization)", label: "Organizations" }, 
  { id: "grants",  filter: "type:(*Grant)", label: "Grants" }, 
  { id: "courses",  filter: "type:(*Course)", label: "Courses" },
  { id: "artisticworks",  filter: "type:(*ArtisticWork)", label: "Artistic Works" },
  { id: "subjectheadings", filter: "type:(*Concept)", label: "Subject Headings" },
  { id: "misc",  filter: "type:(NOT((*Person) OR (*AcademicArticle) OR (*Organization) OR (*Grant) OR (*Course) OR (*ArtisticWork) OR (*Concept)))",
   label: "Misc"
  }
]


// just a helper function to avoid the boilerplate stuff
function setupDefaultSearch(searcher, start, rows, filter) {

  //let start = searchFields ? Math.floor(searchFields['start'] || 0) : 0
  //let filter = searchFields ? (searchFields['filter'] || 'person') : 'person'

  // NOTE: Math.floor probably not necessary
  searcher.options = {
    wt: "json",
    hl: true,
    rows: Math.floor(rows),
    start: Math.floor(start)
  }

  // FIXME: should probalby delete filter just in case
  // e.g. searcher.deleteFilter("type")
  // even though in the action/search.js
  // we re-create searcher object every time
  // 
  if (filter) {
    // could be other kinds of filters (that's why I did 'type')

    let foundFilter = _.find(tabList, function(tab) { return tab.id == filter })
    searcher.addFilter("type", foundFilter.filter)
  }

  // sort: default = score desc
  //
  return searcher
}

// another helper to avoid boilerplate
function setupTabGroups(searcher) {
  // take a SolrQuery object and set up for tabs
  // this is stop-gap until I think of a better way
  // 
  // have to set group = true
  searcher.options = {
    wt: "json",
    rows: 0,
    group: true
  }

  // e.g.
  // it's doing something like this...
  //
  // searcher.addGroupQuery("type-subjectheading", "type:(*Concept)")
  // searcher.addGroupQuery("type-publication", "type:(*Publication)")
  // etc...
  _.forEach(tabList, function(tab) {
     searcher.addGroupQuery("type-"+tab.id, tab.filter)
  })
  
  return searcher

}

export default { setupTabGroups, setupDefaultSearch, buildComplexQuery, SolrResultsParser, tabList }


