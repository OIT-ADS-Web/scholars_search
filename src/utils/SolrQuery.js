import fetch from 'isomorphic-fetch'

import querystring from 'querystring'

import helpers from './SolrHelpers'

class SolrQuery {
 
  // NOTE: 'rows' is in the options {} property
  constructor(selectUrl){
    this.selectUrl = selectUrl
    this._query = "*.*"
    this._facetFields = {}
    this._options = {}
    this._filters = {}

    this._search = {}

    // NOTE: to add group queries the options[group:true] needs to be set
    this._groupQueries = {}

    //
  }

  setupDefaultSearch(start, rows, filter) {
    return helpers.setupDefaultSearch(this, start, rows, filter)
  }

  setupTabGroups() {
    return helpers.setupTabGroups(this)
  }

  addGroupQuery(name, query) {
    // FIXME: should add a check to make sure options[:group] = true is set
    // otherwise solr error could occur
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

  set options(options) {
    Object.assign(this._options,options)
    return this
  }

  get options() {
    return this._options
  }

  
  set search(compoundSearch) {
    // FIXME: would this be a better place to check for
    // filter and start being empty
    //
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
    // am not actually using quite yet
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
    // see here for more complete example of other things 'faceting' can do:
    //
    // http://yonik.com/json-facet-api/

    facets.forEach(facetField => {
      var facetProperties = this._facetFields[facetField]
      Object.keys(facetProperties).forEach(facetProp => {
        facetOptions["f." + facetField + ".facet." + facetProp] = facetProperties[facetProp]
      })
    })

    // example from Jim's original person search
    //}).setFilter("type","classgroup:*people").setFacetField("department_facet_string",{
    //  prefix: "1|",
    //  mincount: "1"
    //})

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
    // NOTE: querystring turns javascript data into queryParams
    //
    // querystring.stringify({ foo: 'bar', baz: ['qux', 'quux'], corge: '' })
    // returns 'foo=bar&baz=qux&baz=quux&corge='

    // e.g. making a big hash {} - the keys being
    // [q, rows, start etc..., fq,   
    var queryOptions = Object.assign({q: this.query},
        this.options,
        this.getFilterOptions(),
        this.getFacetFieldOptions(),
        this.getGroupQueryOptions())

    // NOTE: switched to querystring.stringify, as opposed to manual
    let params = querystring.stringify(queryOptions)
    // still printing for fun
    //console.debug(params)
   
    return this.selectUrl + '?' + params
  }

  buildQuery(compoundSearch = {}) {
    let query = helpers.buildComplexQuery(compoundSearch)
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

export default SolrQuery
// FIXME: could make default = SolrQuery, then export others
// just makes importing a little easier

