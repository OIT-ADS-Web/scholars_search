// FIXME: not using this at the moment
// likely still in dependencies
//import fetch from 'isomorphic-fetch'

//var config = require('config');

import xr from 'xr'

import fetch from 'isomorphic-fetch'

//if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
//  var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
//}

//var xr = new XMLHttpRequest();

export default class SolrQuery {
  constructor(selectUrl){
    this.selectUrl = selectUrl
    this._query = "*.*"
    this._facetFields = {}
    this._options = {}
    this._filters = {}
  }

  set query(query) {
    this._query = query
    return this  
  }

  get query() {
    return this._query
  }

  set options(options) {
    Object.assign(this._options,options)
    return this
  }

  get options() {
    return this._options
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
    var facetOptions = {}
    var facets = Object.keys(this._facetFields)
    if (facets.length > 0) {
      facetOptions = {
        facet: true,
        "facet.field": facets
      }
    }
    facets.forEach(facetField => {
      var facetProperties = this._facetFields[facetField]
      Object.keys(facetProperties).forEach(facetProp => {
        facetOptions["f." + facetField + ".facet." + facetProp] = facetProperties[facetProp]
      })
    })
    return facetOptions
  }

  setFilter(name,query) {
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

  // Build QueryString manually since built-in xr function won't duplicate array params
  // Need this for multiple facet.field parameters
  get queryString() {
    var queryOptions = Object.assign({q: this.query},this.options,this.getFilterOptions(),this.getFacetFieldOptions())
    var params =  Object.keys(queryOptions).map(key => {
      let value = queryOptions[key]
      if (Array.isArray(value)) {
        // duplicate param name for any array values
        return value.map(v => key + "=" + escape(v)).join('&')
      } else {
        return key + "=" + escape(value)
      }
    }).join('&')
    return this.selectUrl + '?' + params
  }

  gatherStatements(words, delimiter) {
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


  buildComplexQuery(compoundSearch = {}) {
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

    // split by "," or <space>
    //
    // allWords => array
    // exactMatch != array
    // atLeastOne => array
    // noMatch => array
    // listing in same order as form
    const allWords = compoundSearch.allWords.split(/[ ,]+/)
    const exactMatch = compoundSearch.exactMatch
    const atLeastOne = compoundSearch.atLeastOne.split(/[ ,]+/)
    const noMatch = compoundSearch.noMatch.split(/[ ,]+/)

    if (noMatch &&  !(allWords || exactMatch || atLeastOne)) {
       //NOTE:  (can't NOT without something to match to begin with)
       return ''
    }

    var queryArray = []
    
    var allWordsExp = this.gatherStatements(allWords, " AND ")
    if (allWordsExp) { queryArray.push(allWordsExp) }
    
    if (exactMatch) { queryArray.push("\""+exactMatch+"\"") }

    var atLeastOneExp = this.gatherStatements(atLeastOne,  " OR ")
    if (atLeastOneExp) { queryArray.push(atLeastOneExp) }

    if (noMatch != false) {
     var noMatchExp = "NOT " + this.gatherStatements(noMatch, " OR ")
     if (noMatchExp) { queryArray.push(noMatchExp) }
    }

    // take out empty "" entries, just in case made it this far
    // http://stackoverflow.com/questions/281264/remove-empty-elements-from-an-array-in-javascript
    queryArray = queryArray.filter(function() { return true; })
    //queryArray = queryArray.filter(Boolean)
 
    query = queryArray.join(" AND ")

    console.log(`QUERY=${query}`)

    return query

  }

  // http://stackoverflow.com/questions/30008114/how-do-i-promisify-native-xhr
  makeRequest(method, url) {
  
    return new Promise(function (resolve, reject) {
      
      if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
      }


      var xhr = new XMLHttpRequest()
      xhr.open(method, url)
      console.log("makeRequest"+url)

      xhr.onload = function () {
        if (this.status >= 200 && this.status < 300) {
          //console.log("got > 200 or < 300")
          //console.log(xhr.responseText)
          resolve(xhr.responseText)
        } else {
          reject({
            status: this.status,
            statusText: xhr.statusText
          })
        }
      }

      xhr.onerror = function () {
        reject({
          status: this.status,
          statusText: xhr.statusText
        })
      }
      xhr.send();
    })
  }


  /*
  function makeRequest (method, url, done) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = function () {
      done(null, xhr.response);
    };
    xhr.onerror = function () {
      done(xhr.response);
    };
    xhr.send();
  }
  */

  execute_and_print() {
    var xhr = new XMLHttpRequest()
    xhr.open("GET", this.queryString)

    xhr.onload = function() {
      console.log(xhr.responseText);
    }
    xhr.send()  

  }

  execute() {
    console.log("SolrQuery.execute()")

    console.log(process.env.APP_ENV)

    // FIXME: don't really like this
    //if (process.env.APP_ENV === 'browser') {
    // 
    return xr.get(this.queryString)
    //}
    //return fetch(this.queryString)
  }
  
  execute_console() {

   //import xr from 'xr'

    //var X = require("xmlhttprequest").XMLHttpRequest;
    
    //if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    console.log("trying xmlhttprequest")

    //return fetch(this.queryString)
    return this.makeRequest("GET", this.queryString)
    //} else {
    //  console.log("trying xr")
    //  var xr = require("xr").xr
    //  return xr.get(this.queryString)
    //}

  
    //var xhr = new XMLHttpRequest()

    //var result = new Promise(function(resolve, reject) {
    //  xhr.open("GET", this.queryString)
   //
   //   xhr.send();  
 
     
   //   if (/* everything turned out fine */) {
   //     resolve(console.log(xhr.responseText));
        // 
        //resolve("Stuff worked!");
   //   }
   //   else {
   //     reject(Error("It broke"));
   //   }
   // });

   //xhr.open("GET", this.queryString)

   //xhr.onload = function() {
   // console.log(xhr.responseText);
   //};
   //xhr.send();  

    //return this.makeRequest("GET", this.queryString)

   //return xr.get(this.queryString)
  }

}

