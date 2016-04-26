import fetch from 'isomorphic-fetch'

var _ = require('lodash');

import querystring from 'querystring'

function gatherStatements(words, delimiter) {
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

// FIXME: need a string representation for display purposes - is this the
// best place for that?

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
  // NOTE: NOT that is alone returns no results

  //
  var query = ""
  if (_.isEmpty(compoundSearch)) {
    return query
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

// NOTE: SOLR accepts a JSON POST as a query
// $ curl http://localhost:8983/solr/query -d '
//{
//  query:"hero"
//}'
// but I can't
// seem to get it to work - so defaulting to 
// building GET with params
//}'

// NOTE: not using this at the moment
class SolrResultsParser {


   // FIXME: is this really necessary?
   // solr results are already an object
   constructor() {

     //let { highlighting={}, response={} } = results;
     //let { numFound=0,docs } = response;

     //this.highlighting = highlighting
     //this.response = response
     //this.numFound = numFound
     //this.docs = docs

   }

   parseResponse(results) {
     let { highlighting={}, response={} } = results;
     let { numFound=0,docs } = response;
     
     // 
     return { numFound: numFound, docs: docs, highlighting: highlighting }
    
     /* results {
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


    */


   }

   parseGroups(grouped) {

   // this is what is received
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
      *  etc...
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
// tabs should be: 
// [People][Publications][Artistic Works][Grants][Subject Headings]
// might need a misc - type NOT (*Articisic OR *Publication etc...)
//
export const namedFilters = {
  type: {
    person: "type:(*Person)",
    publications: "type:(*AcademicArticle)",
    organizations: "type:(*Organization)",
    grants: "type:(*Grant)",
    courses: "type:(*Course)",
    artisticworks: "type:(*Artistic)",
    subjectheadings: "type:(*Concept)",
    misc: "type:(NOT((*Person) OR (*AcademicArticle) OR (*Organization) OR (*Grant) OR (*Course) OR (*Artistic) OR (*Concept)))"
  }
}


function setupDefaultSearch(searcher, start, rows, filter) {

  searcher.options = {
    wt: "json",
    rows: rows,
    hl: true,
    start: start
  }

  // FIXME: should probalby delete filter just in case
  // e.g. searcher.deleteFilter("type")
  // even though in the action/search.js
  // we re-create searcher object every time
  // 
  // there is no need to use search.deleteFilter("type")
  //
  if (filter) {
    // FIXME: need to more centralize this since it's 
    // related to tabs (therefore grouping etc...)
    //
    const typeFilters = namedFilters["type"]
    const foundFilter = typeFilters[filter]
    searcher.addFilter("type", foundFilter)
  }

  return searcher
}

function setupTabGroups(searcher) {
  // take a SolrQuery object and set up for tabs
  // this is stop-gap until I think of a better way
  // should be these: 
  //
  // [People][Publications][Artistic Works][Grants][Subject Headings] ??? + [Courses][Misc]
  //
  // e.g.
  //
  // FIXME: these are the tabs - so the definition should be
  // centralized in some way
  //
  //  searcher.addGroupQuery("type-subject-heading", "type:(*Concept)")
  //  searcher.addGroupQuery("type-publication", "type:(*Publication)")
  //  searcher.addGroupQuery("type-person", "type:(*Person)")
  //  searcher.addGroupQuery("type-organization", "type:(*Organization)")


  searcher.options = {
    wt: "json",
    rows: 0,
    group: true
  }


  _.forEach(namedFilters['type'], function(value, key) {
    searcher.addGroupQuery("type-"+key, value)
  })

  return searcher

}

export { setupTabGroups, setupDefaultSearch }

class SolrQuery {
 
  constructor(selectUrl){
    this.selectUrl = selectUrl
    this._query = "*.*"
    this._facetFields = {}
    this._options = {}
    this._filters = {}

    this._search = {}

    this._rows = 50 // FIXME: should this pull from a config or global var


    // NOTE: to add group queries the options[group:true] needs to be set
    this._groupQueries = {}

    //
  }

  setupDefaultSearch(start, rows, filter) {
    return setupDefaultSearch(this, start, rows, filter)
  }

  setupTabGroups() {
    return setupTabGroups(this)
  }

  addGroupQuery(name, query) {
    // FIXME: should add a check to make sure options[:group] = true is set
    //
    var groupQuery = {}
    groupQuery[name]=query
    Object.assign(this._groupQueries,groupQuery)
    return this
  }

  set query(query) {
    this._query = query
    return this  
  }

  get query() {
    return this._query
  }

  set rows(rows) {
    this._rows = rows
    return this  
  }

  get rows() {
    return this._rows
  }


  set options(options) {
    Object.assign(this._options,options)
    return this
  }

  get options() {
    return this._options
  }

  
  set search(compoundSearch) {
    this._search = compoundSearch
    // FIXME: is this a good idea or not, want
    // to hide the implementation
    let qry = this.buildQuery(compoundSearch)
    this.query = qry

    return this;
  }

  deleteOption(option){
    delete this.options[option];
    return this
  }

  setFacetField(name,options={}) {
    this._facetFields[name] = options
    return this
  }

  deleteFacetField(name) {
    delete this._facetFields[name]
    return this
  }


  getFacetFieldOptions() {
    // NOTE: facet queries build up like this: 
    // f.<fieldName>.<FacetParam>=<value>
    // https://wiki.apache.org/solr/SimpleFacetParameters
    //
    var facetOptions = {}
    var facets = Object.keys(this._facetFields)
    if (facets.length > 0) {
      facetOptions = {
        facet: true,
        "facet.field": facets
      }
    }
    // so the hash looks like this now
    // { facet: true, facet.fields: [field1, field2 ...]}
    //
    // http://yonik.com/json-facet-api/
    //
    //example:
    //&facet=true
    //&facet.range={!key=age_ranges}age
    //&f.age.facet.range.start=0
    //&f.age.facet.range.end=100
    //&f.age.facet.range.gap=10
    //&facet.range={!key=price_ranges}price
    //&f.price.facet.range.start=0
    //&f.price.facet.range.end=1000
    //&f.price.facet.range.gap=50


    // or json
    /*
    {
      age_ranges: {
        type : range
        field : age,
        start : 0,
        end : 100,
        gap : 10
      }
      ,
      price_ranges: {
        type : range
        field : price,
        start : 0,
        end : 1000,
        gap : 50 
      }
    }

    field – The field name to facet over.
    offset – Used for paging, this skips the first N buckets. Defaults to 0.
    limit – Limits the number of buckets returned. Defaults to 10.
    mincount – Only return buckets with a count of at least this number. Defaults to 1.
    sort – Specifies how to sort the buckets produced. “count” specifies document count, “index” 
      sorts by the index (natural) order of the bucket value. One can also sort by any facet function / statistic 
      that occurs in the bucket. The default is “count desc”. This parameter may also be specified in JSON like 
      sort:{count:desc}. The sort order may either be “asc” or “desc”
    missing – A boolean that specifies if a special “missing” bucket should be returned that is defined by documents without a value in the field. Defaults to false.
    numBuckets – A boolean. If true, adds “numBuckets” to the response, an integer representing the number of buckets for the facet (as opposed to the number of buckets returned). Defaults to false.
    allBuckets – A boolean. If true, adds an “allBuckets” bucket to the response, representing the union of all of the buckets. For multi-valued fields, 
      this is different than a bucket for all of the documents in the domain since a single document can belong to multiple buckets. Defaults to false.
    prefix – Only produce buckets for terms starting with the specified prefix.
    method – Provides an execution hint for how to facet the field.
      method:uif – Stands for UninvertedField, a method of faceting indexed, multi-valued fields using top-level data structures that optimize for performance over NRT capabilities.
      method:dv – Stands for DocValues, a method of faceting indexed, multi-valued fields using per-segment data structures. This method mirrors faceting on real 
        docValues fields but works by building on-heap docValues on the fly from the index when docValues aren’t available. This method is better for a quickly changing index.
      method:stream – This method creates each individual facet bucket (including any sub-facets) on-the-fly while streaming the response back to the requester. 
        Currently only supports sorting by index order.    
   */

    facets.forEach(facetField => {
      var facetProperties = this._facetFields[facetField]
      Object.keys(facetProperties).forEach(facetProp => {
        facetOptions["f." + facetField + ".facet." + facetProp] = facetProperties[facetProp]
      })
    })

    // example from original person search
    //}).setFilter("type","classgroup:*people").setFacetField("department_facet_string",{
    //  prefix: "1|",
    //  mincount: "1"
    //})


    // it would look like this now:
    // { facet: true, facet.fields: [field1, field2 ...], f.field1.facet.range.start=0, etc... }
    // facetFields = {field1: 'facet.range.start
    //
    //
    return facetOptions
  }


  // NOTE: just like above - except for making a URL like so:
  //  ...&group=true&group.query=type:(*Concept)&group.query=type:(*Publication)
  getGroupQueryOptions() {

    var groupOptions = {}
    const groups = Object.keys(this._groupQueries).map(key => this._groupQueries[key]);

    //var groups = Object.values(this._groupQueries)
    if (groups.length > 0) {
      groupOptions = { group: true, "group.query": groups }
    }
    
    return groupOptions
  }


  addFilter(name,query) {
    var filter = {}
    filter[name]=query
    Object.assign(this._filters,filter)
    return this
  }

  deleteFilter(name) {
    delete this._filters[name]
    return this
  }

  getFilterOptions() {
    var filterQueries = Object.keys(this._filters).map(filterName => this._filters[filterName])
    return {
      fq:filterQueries
    }
  }

  get queryString() {
    // FIXME: look into querystring.stringify
    // querystring.stringify({ foo: 'bar', baz: ['qux', 'quux'], corge: '' })
    // returns 'foo=bar&baz=qux&baz=quux&corge='

    // e.g. making a big {} - the keys being
    // [q, rows, start etc..., fq,   
    var queryOptions = Object.assign({q: this.query},
        this.options,
        this.getFilterOptions(),
        this.getFacetFieldOptions(),
        this.getGroupQueryOptions())

    // NOTE: switched to querystring.stringify, as opposed to manual
    let params = querystring.stringify(queryOptions)
    // still printing for fun
    console.log(params)
   
    return this.selectUrl + '?' + params
  }

  buildQuery(compoundSearch = {}) {
    let query = buildComplexQuery(compoundSearch)
    return query
  }

  execute() {

    // FIXME: would be great if I could send JSON
    // fetch(queryString, {method: 'GET',  
    //  header: {
    //    'Accept': 'application/json',
    //    'Content-Type': 'application/json'
    //  }
    // })
    //

    let attempt = fetch(this.queryString)
    return attempt

  }
  
}

export default { SolrQuery, buildComplexQuery, namedFilters, SolrResultsParser }
// FIXME: could make default = SolrQuerh, then export others

