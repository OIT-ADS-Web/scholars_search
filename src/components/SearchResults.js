import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Loading from './Loading'
import SearchTabs from './SearchTabs'
import PagingPanel from './PagingPanel'

require('../styles/scholars_search.less');

import solr from '../utils/SolrHelpers'

import {saveAs} from 'file-saver'

import _ from 'lodash'

import { fetchSearchApi } from '../actions/sagas'

import TabPicker from './TabPicker'

import querystring from 'querystring'

// PersonTab extends SearchResults ??
// etc...
//

import { requestSearch } from '../actions/search'

export class SearchResults extends Component {

  static get contextTypes() {
    return({
      router: PropTypes.object
    })
  }

  constructor(props, context) {
    super(props, context);
    
    this.handleDownload = this.handleDownload.bind(this)
    //http://stackoverflow.com/questions/23123138/perform-debounce-in-react-js
    this.handleDownload= _.debounce(this.handleDownload,1000);
    this.handleSort = this.handleSort.bind(this)
  }

  
  handleDownload() {
    // NOTE: I get this warning when I added (e) as parameter and used e.preventDefault():
    //
    // "This synthetic event is reused for performance reasons. If you're seeing this, you're calling `preventDefault` 
    // on a released/nullified synthetic event. This is a no-op. See https://fb.me/react-event-pooling for more information."
    const { search : { searchFields } } = this.props

    // FIXME: this same logic appears in many places - it should be centralized
    let filter = searchFields ? (searchFields['filter'] || 'person') : 'person'
    // FIXME: I think this needs to:
    // a) run search (but not dispatch?)
    // b) or have a new DOWNLOAD_SEARCH action ??
    // c) get results into csv or xml format
    // d) the new Blob(--results --, {type: xml or text })
    // e) make a good name -- with the date at least e.g. search_results_people_2016_05_31.(xml|csv)

    let today = new Date()
    let todayStr = today.toISOString().substring(0,10) // ISOString Returns 2011-10-05T14:48:00.000Z
    let format = 'csv'
    let maxRows = 999 // NOTE: solr-proxy limits this to <= 1000 (at the moment) 

    let fileName = `search_results_${filter}_${todayStr}.${format}`
    let figureType  = function(format) {
      if (format == 'xml') { return "text/xml" }
      else if (format == 'csv') { return "text/csv" }
      else { return "text/plain" }
    }
    let type = `${figureType(format)};charset=utf-8`

    let tabPicker = new TabPicker(filter)

    fetchSearchApi(searchFields, maxRows).then(function(json) {

      let csv = tabPicker.toCSV(json)
      let blob = new Blob(csv, {type: type})
      // FIXME: much more to do here - just proving I can download a file now
      saveAs(blob, fileName)
 
    })
   
  }
  

  handleSort() {
    const { search : { searchFields } } = this.props
    
    let sort = this.sort

    // 1. add sort to parmams - search etc...
    // setting default start to 0 - so paging is reset
    const query  = {...searchFields, start: 0, sort: sort }

    // 2. run search again 
    dispatch(requestSearch(query))
    
    // NOTE: took me a while to figure out I couldn't just pass
    // searchFields as {query: searchFields} had to copy it (see above)
    this.context.router.push({
      pathname: '/',
      query: query
    })
    // 3. let display take care of itself - but { sort } needs to be set
    // in some way (for the <select><option value >)
  }


  handleFacetClick(e) {
    const { search : { searchFields }, dispatch } = this.props
    
    let query = solr.buildComplexQuery(searchFields)
     
    // FIXME: this same logic appears in many, many places - it should be centralized
    // or defaulted at a higher level, or something
    let filter = searchFields ? (searchFields['filter'] || 'person') : 'person'
    
    let tabPicker = new TabPicker(filter)

    let id = e.target.id
 
    let filterQueries = tabPicker.filterQueries(query)

    let found = _.find(filterQueries, function(o) { return o.id === id })
    let filterQuery = found ? found.query : null
 
    let full_query = { ...searchFields }
    full_query['start'] = 0

    let currentFilterQueries = querystring.parse(searchFields['filter_queries'])

    if (e.target.checked) {
      let keys = _.keys(currentFilterQueries).sort()

      if (keys.length > 0) {
        let highest = _.parseInt(_.last(keys))
      
        console.log(highest)
        let next = highest + 1
      
        console.log(next)

        currentFilterQueries[next] = filterQuery
         full_query['filter_queries'] = querystring.stringify(currentFilterQueries)
      } else {
         full_query['filter_queries'] = querystring.stringify([filterQuery])
 
      }

      dispatch(requestSearch(full_query))

      //this.context.router.push({
      //  pathname: '/',
      //  query: full_query
      //})

    } else {
      let toDelete = _.findKey(currentFilterQueries, function(o) { return o === filterQuery })
 
      delete currentFilterQueries[toDelete]

      let newFilterQueries = currentFilterQueries

      // FIXME: need a way to keep filter_queries we've already added
      full_query['filter_queries'] = querystring.stringify(newFilterQueries)
      
      dispatch(requestSearch(full_query))
    }
    

  }

  render() {
    const { search : { results, searchFields, isFetching, message } } = this.props

    // FIXME: this same logic appears in many places - it should be centralized
    let filter = searchFields ? (searchFields['filter'] || 'person') : 'person'

    let { highlighting={}, response={}, facet_counts={} } = results
    let { numFound=0,docs } = response
    let { facet_queries, facet_fields } = facet_counts
    // data will look like this (for subject heading for instance):
    /*
      facet_counts:
      { 
         facet_queries: { 'nameText:"medicine"': 8, 'ALLTEXT:"medicine"': 0 },
         facet_fields: {},
         facet_dates: {},
         facet_ranges: {} 
      },
    */

    let tabResults = ""
    let tabPicker = new TabPicker(filter)
    
    if (docs) {
      tabResults = tabPicker.results(docs, highlighting)
    }
    else {
      // e.g. if there are no docs - could be fetching, or could just be no
      // search.  So ... add <Loading> just in case.
      // FIXME: what to do if search error? e.g. if (message) { }
      console.log("SearchResults.render() - NO DOCS")
      return ( 
        <div className="row">
          <Loading isFetching={isFetching}></Loading>
        </div>
      )
    }

    // NOTE: a textual representation of the complex search
    // right now it is exactly the same as what's actually sent
    // to Solr - which is maybe fine
    let query = solr.buildComplexQuery(searchFields)
    let tabFacets = ""

    // FIXME: not ordered correctly - also ugly display of actual query, need an alias of some sort
    // for display purposes
    //
    //
    // filterQueries(base_qry) {
    //  return [
    //   {id: 'sh_name_fq', tag: 'match', query: `{!tag=match}nameText:${base_qry}`}
    //  ]
    // }


    let filter_queries = searchFields ? (querystring.parse(searchFields['filter_queries']) : null) : null

    let chosen_ids = []
    let possible_matches = tabPicker.findFilterMatches(query, filter_queries)

    if (possible_matches.length > 0) {
       chosen_ids = chosen_ids.concat(possible_matches)
    }

    // NOTE: this gets complicated with facet.field vs facet.query
    //
    //
    // FIXME: how to get this here on tab initialize (not just tab click)
    if (facet_queries) {
      let cb = this.handleFacetClick.bind(this)
      tabFacets = tabPicker.facets(query, facet_queries, chosen_ids, cb)
    }

    // FIXME: new variable, or append to ?
    let facetFieldDisplay = ""   
    if (facet_fields) {
      //      {field: 'department_facet_string', options: {prefix: "1|", missing: "true"}} 
 
      // don't need 'query' but it doesn't hurt anything to send
      // still ... facets() will react different depending on 
      // facet.query or facet.field
      facetFieldDisplay = tabPicker.facetFieldDisplay(facet_fields)
      //console.log(tabPicker.facetFieldDisplay(facet_fields))
    }
    

    // FIXME: the sorter - select should be it's own component at least
    // maybe even entire 'row' - download could be too ...

    // let sortOptions = tabPicker.sortOptions()
    //
    // let sortOptions = (   
    //   <select onSelect={() => this.onSort()} className="form-control" defaultValue="score desc">
    //        <option value="score desc">Relevance</option>
    //    </select>
    //  )
   
    return (
      <section className="search-results">
        <div className="search-results-header">
          <div className="pull-left lead"><strong>Query: {query}</strong></div>
        </div>
        
        <SearchTabs />
        
        <div className="search-results-table">
         
          <div className="row panel">
            <div className="col-md-10">          
             {tabResults} 
           </div>
           <div className="col-md-2 panel panel-info">
              <div className="panel-body">
                <button type="button" className="btn btn-default btn-small" onClick={this.handleDownload}>
                  <span className="glyphicon glyphicon-download"> Download </span>
                </button>
              </div>
              {tabFacets}

              {facetFieldDisplay}
           </div>
          </div>

        </div>

        <PagingPanel></PagingPanel>

    </section>

    )
  }

}



const mapStateToProps = (search, ownProps) => {
  return { ...search }
}


export default connect(mapStateToProps)(SearchResults)

