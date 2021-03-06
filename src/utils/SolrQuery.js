import fetch from 'isomorphic-fetch'

import querystring from 'querystring'

import helpers from './SolrHelpers'

/*

VIVO solrconfig.xml:

      <lst name="defaults">
       <str name="defType">edismax</str>
       <!-- nameText added for NIHVIVO-3701 -->
       <str name="qf">ALLTEXT ALLTEXTUNSTEMMED nameText^2.0 nameUnstemmed^2.0 nameStemmed^2.0 nameLowercase</str>
       <str name="echoParams">explicit</str>
       <str name="qs">2</str>
       <int name="rows">10</int>
       <str name="q.alt">*:*</str>
       <str name="fl">*,score</str>
       <str name="hl">true</str>
       <str name="hl.fl">ALLTEXT</str>
       <str name="hl.fragsize">160</str>
      <!--  Default value of mm is 100% which should result in AND behavior, still setting it here
      https://cwiki.apache.org/confluence/display/solr/The+DisMax+Query+Parser -->
      <str name="mm">100%</str>
     </lst>
 
also see /srv/web/apps/vivo/solr/conf/schema.xml


*/

class SolrQuery {
 
  // NOTE: 'rows' is in the options {} property
  constructor(selectUrl){
    this.selectUrl = selectUrl
    // FIXME: maybe default to somethign else, that returns nothing?
    this._query = "*.*"
    
    this._options = {}
    this._filters = {}

    this._search = {}
    
    this._facetFields = {}
    this._facetQueries = {}
    this._facetLocalParams = {}


    // NOTE: to add group queries the options[group:true] needs to be set
    this._groupQueries = {}

    //
  }

  setupDefaultSearch(rows, start) {
    return helpers.setupDefaultSearch(this, rows, start)
  }

  setupTabGroups(tabList) {
    return helpers.setupTabGroups(this, tabList)
  }

  addGroupQuery(name, query) {
    // FIXME: should add a check to make sure options[:group] = true is set
    // otherwise solr error could occur
    //
    // FIXME: to make type:(*Concept) AND nameText:%s 
    let groupQuery = {}
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

  setOption(key, value) {
   this._options[key] = value
  }

  get options() {
    return this._options
  }

  // NOTE: 'compoundSearch' is the data structure used to represent a search
  // { 'allWords': 'medicine', 'rows': 50, 'filter': 'person' etc ... } and
  set search(compoundSearch) {
    // FIXME: would this be a better place to check for
    // 'filter' and/or 'start' being empty?
    //
    // NOTE: 'filter' is sent to SOLR differently
    // 
    // let filter = compoundSearch['filter']
    // if (filter) {
    //  // could be other kinds of filters (that's why I did 'type')
    //  searcher.deleteFilter("type") // just in case we had one lingering
    //  let foundFilter = _.find(tabList, function(tab) { return tab.id == filter })
    //  searcher.addFilter("type", foundFilter.filter)
    //  compoundSearch = _.omit(compoundSearch, 'filter') 
    //}

    this._search = compoundSearch
    let qry = this.buildQuery(compoundSearch)
    this.query = qry

    return this;
  }

  deleteOption(option){
    delete this.options[option];
    return this
  }

  // NOTE: this effectively *adds*, so could be called 'set-A-facet-field'
  setFacetField(name,options={}) {
    this._facetFields[name] = options
    return this
  }

  setFacetQuery(name, options={}) {
    this._facetQueries[name] = options
    return this
  }

  setFacetLocalParam(name, param) {
    this._facetLocalParams[name] = param
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
    let facetOptions = {}
    let facets = Object.keys(this._facetFields)
    let queries = Object.keys(this._facetQueries)
    
    let facetParams = Object.keys(this._facetLocalParams)
    
    if (facets.length > 0 || queries.length > 0) {
      facetOptions['facet'] = true
    } else {
      return facetOptions
    }

    // NOTE: this is only where the {!ex=tag} should go 
    // in order to get counts for facets back - and apply filters
    // without losing those counts - we need to add {!ex=<?tag>} to
    // the facet query - and then {!tag=<?tag>} to the filter
    //
    if (facets.length > 0) {
      
      if (facetParams.length > 0) {
        let _self = this
        let alteredFacets = facets.map(function(f) {
          // needs to find a matching localParam
          let params = _self._facetLocalParams[f]
          return `${params}${f}`
        })

        facetOptions["facet.field"] = alteredFacets    
      } else {
        facetOptions["facet.field"] = facets
      }
    }
    

    if (queries.length > 0) {
      facetOptions["facet.query"] = queries
    }

    // NOTE: can override by field
    facets.forEach(facetField => {
      let facetProperties = this._facetFields[facetField]
      Object.keys(facetProperties).forEach(facetProp => {
        facetOptions["f." + facetField + ".facet." + facetProp] = facetProperties[facetProp]
      })
    })

    return facetOptions
  }


  // NOTE: just like above - except for making a URL like so:
  //  ...&group=true&group.query=type:(*Concept)&group.query=type:(*Publication)
  getGroupQueryOptions() {

    let groupOptions = {}
    const groups = Object.keys(this._groupQueries).map(key => this._groupQueries[key]);

    if (groups.length > 0) {
      groupOptions = { group: true, "group.query": groups }
    }
    
    return groupOptions
  }


  addFilter(name,query) {
    let filter = {}
    filter[name]=query
    Object.assign(this._filters,filter)
    return this
  }

  deleteFilter(name) {
    delete this._filters[name]
    return this
  }

  getFilterOptions() {
    let filterQueries = Object.keys(this._filters).map(filterName => this._filters[filterName])
    return {
      fq:filterQueries
    }
  }

  get queryString() {
    // NOTE: querystring library turns javascript data into queryParams
    //
    // querystring.stringify({ foo: 'bar', baz: ['qux', 'quux'], corge: '' })
    // returns 'foo=bar&baz=qux&baz=quux&corge='

    // so this code is making a big hash {} - the keys being
    // [q, rows, start etc..., fq,   
    let queryOptions = Object.assign({q: this.query},
        this.options,
        this.getFilterOptions(),
        this.getFacetFieldOptions(),
        this.getGroupQueryOptions())

    let params = querystring.stringify(queryOptions)
    return this.selectUrl + '?' + params
  }

  buildQuery(compoundSearch = {}) {
    let query = helpers.buildComplexQuery(compoundSearch)
    return query
  }

  execute() {

    // FIXME: would be great if I could send JSON, someday
    // fetch(queryString, {method: 'GET',  
    //  header: {
    //    'Accept': 'application/json',
    //    'Content-Type': 'application/json'
    //  }
    // })

    let attempt = fetch(this.queryString)
    return attempt

  }
  
}

export default SolrQuery

