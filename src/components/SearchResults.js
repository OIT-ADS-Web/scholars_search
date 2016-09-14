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

import { requestSearch } from '../actions/search'

import ReactDOM from 'react-dom'

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

    this.handleFacetClick = this.handleFacetClick.bind(this)
 
    this.path = "/"
  }

  
  componentDidUpdate() {
    // NOTE: this does NOT work, but is supposed to
    //ReactDOM.findDOMNode(this).scrollTop = 0
    
    // NOTE: this DOES work
    //window.scrollTo(0, 0)
    // clear facets here ???
  }
  

  
  shouldComponentUpdate(nextProps, nextState) {
    const { search : { isFetching, message, lastUpdated }} = nextProps
 
    // NOTE: sometimes this makes debugging a little easier
    // (since it just forces the component to update regardless)
    //return true

    let now = Date.now()
    let timeElapsed = now - lastUpdated
    
    if ((isFetching && !message)) {
      return false
    } else if ((!isFetching) && (timeElapsed > 0)) {
      return true
    } else {
      return true
    }
    
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

    // FIXME: this needs to apply facets
    let tabPicker = new TabPicker(filter)
    let tab = tabPicker.tab

    // FIXME: once again doing this check -- needs to be centralized in some manner
    let chosen_ids = searchFields['facetIds'] ? searchFields['facetIds'] : []
    
    // have to convert to array if it's a single value
    if (typeof chosen_ids === 'string') {
       chosen_ids = [chosen_ids]
    }
 
    // FIXME: don't like having to always remember to call these methods 
    tab.setActiveFacets(chosen_ids)

    // FIXME: this is reproducing search already performed.  As the search gets more
    // complex (facets etc...) this will get more complex
    //
    fetchSearchApi(searchFields, tab, maxRows).then(function(json) {

      let csv = tab.toCSV(json)
      let blob = new Blob(csv, {type: type})
      // FIXME: much more to do here - just proving I can download a file now
      saveAs(blob, fileName)
 
    })
   
  }
  

  handleSort() {
    const { search : { searchFields } } = this.props
 
    // FIXME: this same logic appears in many places - it should be centralized
    let filter = searchFields ? (searchFields['filter'] || 'person') : 'person'

    let sort = this.sort

    // 1. add sort to parmams - search etc...
    // setting default start to 0 - so paging is reset
    const query  = {...searchFields, start: 0, sort: sort }

    let tabPicker = new TabPicker(filter)
    let tab = tabPicker.tab

    // 2. run search again 
    dispatch(requestSearch(query, tab))
    
    // NOTE: took me a while to figure out I couldn't just pass
    // searchFields as {query: searchFields} had to copy it (see above)
    this.context.router.push({
      pathname: this.path,
      query: query
    })
    // 3. let display take care of itself - but { sort } needs to be set
    // in some way (for the <select><option value >)
  }


  handleFacetClick(e) {
    const { search : { searchFields }, departments: { data }, dispatch } = this.props

    let query = solr.buildComplexQuery(searchFields)
     
    // FIXME: this same logic appears in many, many places - it should be centralized
    // or defaulted at a higher level, or something
    let filter = searchFields ? (searchFields['filter'] || 'person') : 'person'
    
    let tabPicker = new TabPicker(filter)
    let tab = tabPicker.tab
    
    let id = e.target.id

    let full_query = { ...searchFields }
    full_query['start'] = 0

    let chosen_ids = searchFields['facetIds'] ? searchFields['facetIds'] : []
    
    // have to convert to array if it's a single value
    if (typeof chosen_ids === 'string') {
       chosen_ids = [chosen_ids]
    }
  
    if (e.target.checked) {
      chosen_ids.push(id)
    } else {
      chosen_ids = _.filter(chosen_ids, function(o) { return o != id })
    }

    // FIXME: don't like having to remember to do this -- and it's also strangely
    // in search results
    tab.setActiveFacets(chosen_ids)

    // FIXME: since the action requires the tab -- it's mixing things up a bit
    // it actually requires something that can modify the searcher
    // by applying filters, etc ... which is determined from
    // a) filter query param (e.g. 'tab')
    // b) config items associated with that 'tab'
    // c) any facetIds in query params
    // d) anything else the tab might want to do specific that is 
    //    too complicated to be json config property 
    //
    dispatch(requestSearch(full_query, tab))
    full_query['facetIds'] = chosen_ids

    this.context.router.push({
      pathname: this.path,
      query: full_query
    })
    
  }

  render() {
    const { search : { results, searchFields, isFetching, message }, departments: { data } } = this.props

    // FIXME: this same logic appears in many places - it should be centralized
    let filter = searchFields ? (searchFields['filter'] || 'person') : 'person'

    let { highlighting={}, response={}, facet_counts={} } = results
    let { numFound=0,docs } = response
    let { facet_queries, facet_fields } = facet_counts
    
    // response data will look like this (for subject heading for instance):
    /*
      facet_counts:
      { 
         facet_queries: { 'nameText:"medicine"': 8, 'ALLTEXT:"medicine"': 0 },
         facet_fields: {},
         facet_dates: {},
         facet_ranges: {} 
      },
    */

    let tabPicker = new TabPicker(filter)
    let tab = tabPicker.tab

    let tabResults = ""

    if (docs) {
      tabResults = tab.results(docs, highlighting)
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

    // FIXME: needs to be called BEFORE tab.facets is called (so it has
    // meta-data) this seems wrong.  Should be further up in chain
    // because it's loaded when the entire application is loaded
    // although that could be wrong too
    //
    
    let chosen_facets = searchFields['facetIds'] ? searchFields['facetIds'] : []
    
    // FIXME: it's annoying having this everywhere we get the chosen facets
    // in facet it's possible, by this far in the process, that it's already
    // been array-ized 
    if (typeof chosen_facets === 'string') {
      chosen_facets = [chosen_facets]
    }

    // FIXME: don't like having to remember to call this - if we added PeopleTab as
    // a 'connected' compoment, there would be no need (I think)
    tab.setActiveFacets(chosen_facets)
    
    let tabFacets = tab.facets(facet_counts, chosen_facets, this.handleFacetClick, data)

    return (
      <section className="search-results">
        <SearchTabs />

        {/* begin search results table */ }
        <div className="search-results-table fill">
         
          <div className="row panel fill">
            <div className="col-md-9">          
             {tabResults} 
           </div>
           <div className="col-md-3 panel panel-info fill">
              <div className="facet-wrapper">
                
                {tabFacets}
              
                <div className="panel-body text-center">
                  <button type="button" className="btn btn-primary btn-small" onClick={this.handleDownload}>
                    <span>Download results</span>
                  </button>
                </div>
             </div>

           </div>
          </div>

        </div>
        {/* end search results table */ }

        <PagingPanel facets={chosen_facets}></PagingPanel>

    </section>

    )
  }

}



const mapStateToProps = (search, ownProps) => {
  return { ...search }
}


export default connect(mapStateToProps)(SearchResults)

