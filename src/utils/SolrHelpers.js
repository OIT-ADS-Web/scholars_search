import _ from 'lodash'

function isEmptySearch(cs) {
  let flag = false
 
  // FIXME: wow - ugly check for isEmpty ... seems like there's a better way
  if ((cs['exactMatch'] == '' && cs['allWords'] == '' && cs['atLeastOne'] == '' && cs['noMatch'] == '') || 
      (typeof(cs['exactMatch']) == 'undefined' && typeof(cs['allWords']) == 'undefined' && typeof(cs['atLeastOne']) == 'undefined' && typeof(cs['noMatch']) == 'undefined')
     ) {
     
    flag = true
   }

  return flag
}


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
  let query = ""
  if (_.isEmpty(compoundSearch)) {
    return query
  }

  // NOTE: was a separate function, but unlikely to call outside
  // of this context
  let gatherStatements = function(words, delimiter) {
    // given an array and a delimiter, join with that delimiter
    // but also group by parenthesis if necessary
    let exp = words.join(delimiter)
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
  
  const allWords = "allWords" in compoundSearch ? compoundSearch.allWords.trim().split(/[ ,]+/) : [] 
  const exactMatch = "exactMatch" in compoundSearch ? compoundSearch.exactMatch : ''
  const atLeastOne = "atLeastOne" in compoundSearch ? compoundSearch.atLeastOne.trim().split(/[ ,]+/) : []
  const noMatch = "noMatch" in compoundSearch ? compoundSearch.noMatch.trim().split(/[ ,]+/) : []

  if (noMatch &&  !(allWords || exactMatch || atLeastOne)) {
    //NOTE:  (can't NOT without something to match to begin with)
    return ''
  }

  let queryArray = []
    
  let allWordsExp = gatherStatements(allWords, " AND ")
  if (allWordsExp) { queryArray.push(allWordsExp) }
    
  if (exactMatch) { queryArray.push("\""+exactMatch+"\"") }

  let atLeastOneExp = gatherStatements(atLeastOne,  " OR ")
  if (atLeastOneExp) { queryArray.push(atLeastOneExp) }

  if (noMatch != false) {
    let noMatchExp = "NOT " + gatherStatements(noMatch, " OR ")
    if (noMatchExp) { queryArray.push(noMatchExp) }
  }

  // take out empty "" entries, just in case made it this far
  // http://stackoverflow.com/questions/281264/remove-empty-elements-from-an-array-in-javascript
  queryArray = queryArray.filter(function() { return true; })
 
  query = queryArray.join(" AND ")

  return query

}

// NOTE: not using this at the moment, except in one
// example script.
//
// The general idea is to allow the UI
// code to not have to know internals of Solr, like
// highlighting, doc.DocId, ALLTEXT etc... but maybe that's fine
//
class SolrResultsParser {

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

  //parseDocs(docs) {
  //}

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
    let summary = {}
    _.forEach(grouped, function(value, key) {
      summary[key] = value.doclist.numFound
    });

    return summary 
  }


}

/*

   VIVO SOLR config:
   see /srv/web/apps/vivo/solr/conf/schema.xml

*/


// just a helper function to avoid the boilerplate stuff
function setupDefaultSearch(searcher, rows=50, start=0, sort="score desc") {

  // NOTE: Math.floor probably not necessary
  searcher.options = {
    wt: "json",
    hl: true,
    rows: Math.floor(rows),
    start: Math.floor(start),
    sort: sort,
    mm: 2,
    qf: 'duke_text duke_text_unstemmed nameText^2.0 nameUnstemmed^2.0 nameStemmed^2.0 nameLowercase',
    pf: 'duke_text duke_text_unstemmed nameText^2.0 nameUnstemmed^2.0 nameStemmed^2.0 nameLowercase',
    'hl.fragsize': '175',
    'hl.fl': 'duke_text',
    'hl.usePhraseHighlighter': true,
    bq: 'type:(*Faculty)'
  }

  return searcher
}

function setupTabGroups(searcher, tabList) {
  // take a SolrQuery object and set up for tabs
   
  // have to set group = true
  searcher.options = {
    wt: "json",
    rows: 0,
    group: true,
    mm: 2,
    qf: 'duke_text duke_text_unstemmed nameText^2.0 nameUnstemmed^2.0 nameStemmed^2.0 nameLowercase',
    pf: 'duke_text duke_text_unstemmed nameText^2.0 nameUnstemmed^2.0 nameStemmed^2.0 nameLowercase'
  }

  // NOTE: group query given a name for internal use (so I could remove as well as add).  Not needed by SOLR
  // e.g.
  // searcher.addGroupQuery("type-subjectheading", "type:(*Concept)")
  // searcher.addGroupQuery("type-publication", "type:(*Publication)")
  // etc...
  _.forEach(tabList, function(tab) {
    searcher.addGroupQuery("type-"+tab.id, tab.filter)
  })
  
  return searcher

}

export default { setupTabGroups, setupDefaultSearch, buildComplexQuery, SolrResultsParser, isEmptySearch }


