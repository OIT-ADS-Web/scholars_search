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

    this.state = {
      chosen_facets: []
    }

    this.path = "/"
    //this.chosen_ids = []
  }

  
  componentDidUpdate() {
    // NOTE: this does NOT work, but is supposed to
    //ReactDOM.findDOMNode(this).scrollTop = 0
    
    // NOTE: this DOES work
    //window.scrollTo(0, 0)

  }
  

  
  shouldComponentUpdate(nextProps, nextState) {
    const { search : { isFetching, message, lastUpdated }} = nextProps
    
    let now = Date.now()
    let timeElapsed = now - lastUpdated
    
    //console.log("SearchResults#shouldComponentUpdate")
    //console.log(timeElapsed)
    
    if ((isFetching && !message)) {
      return false
    } else if ((!isFetching) && (timeElapsed > 0)) {
      return true
    } else {
      return true
    }
    

    //return true

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

    // FIXME: this gets rid of facets
    let tabPicker = new TabPicker(filter)
    let tab = tabPicker.tab

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
   //const { search : { searchFields }, dispatch } = this.props
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

    let chosen_ids = this.state.chosen_facets
  
    if (e.target.checked) {
      chosen_ids.push(id)
    } else {
      chosen_ids = _.filter(this.state.chosen_facets, function(o) { return o != id })
    }

    // FIXME: this seems wrong.  I can't depend on the state updating
    this.setState({chosen_facets: chosen_ids}, function() {
      // FIXME: needs to be added BEFORE
      tab.addContext({'departments': data })
      tab.setActiveFacets(this.state.chosen_facets)
      dispatch(requestSearch(full_query, tab))
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

    let cb = this.handleFacetClick.bind(this)
    
    // FIXME: needs to be called BEFORE tab.facets is called (so it has
    // meta-data)
    tab.addContext({'departments': data })
    
    let tabFacets = tab.facets(facet_counts, this.state.chosen_facets, cb)

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
            <div className="col-md-9">          
             {tabResults} 
           </div>
           <div className="col-md-3 panel panel-info">
              <div className="panel-body">
                <button type="button" className="btn btn-default btn-small" onClick={this.handleDownload}>
                  <span className="glyphicon glyphicon-download"> Download </span>
                </button>
              </div>
              {tabFacets}
           </div>
          </div>

        </div>

        <PagingPanel facets={this.state.chosen_facets}></PagingPanel>

    </section>

    )
  }

}



const mapStateToProps = (search, ownProps) => {
  return { ...search }
}


export default connect(mapStateToProps)(SearchResults)

