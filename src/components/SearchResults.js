import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import ReactDOM from 'react-dom'

import {saveAs} from 'file-saver'
import querystring from 'querystring'
import _ from 'lodash'

import SearchTabs from './SearchTabs'
import TabResults from './TabResults'
import TabPicker from './TabPicker'

import solr from '../utils/SolrHelpers'

import { fetchSearchApi } from '../actions/sagas'
import { requestSearch } from '../actions/search'

require('../styles/scholars_search.less');

export class SearchResults extends Component {

  static get contextTypes() {
    return({
      router: PropTypes.object
    })
  }

  constructor(props, context) {
    super(props, context)
    
    this.handleDownload = this.handleDownload.bind(this)
    //http://stackoverflow.com/questions/23123138/perform-debounce-in-react-js
    this.handleDownload= _.debounce(this.handleDownload,1000)
    
    //this.handleSort = this.handleSort.bind(this)

    this.handleFacetClick = this.handleFacetClick.bind(this)
    // NOTE: strangely this does not work at all
    //this.handleFacetClick = _.debounce(this.handleFacetClick, 1000)

    this.path = "/"
  }

  
  handleDownload() {
    // NOTE: I get this warning when I added (e) as parameter and used e.preventDefault():
    //
    // "This synthetic event is reused for performance reasons. If you're seeing this, you're calling `preventDefault` 
    // on a released/nullified synthetic event. This is a no-op. See https://fb.me/react-event-pooling for more information."
    const { search : { searchFields } } = this.props

    // FIXME: this same logic appears in many places - it should be centralized
    let filter = searchFields ? (searchFields['filter'] || 'person') : 'person'

    let today = new Date()
    let todayStr = today.toISOString().substring(0,10) // ISOString Returns 2011-10-05T14:48:00.000Z
    let format = 'csv'
    let maxRows = 999 // NOTE: solr-proxy limits this to <= 1000 (at the moment) 

    let fileName = `search_results_${filter}_${todayStr}.${format}`
    let determineType  = function(format) {
      if (format == 'xml') { return "text/xml" }
      else if (format == 'csv') { return "text/csv" }
      else { return "text/plain" }
    }
    let type = `${determineType(format)};charset=utf-8`

    let tabPicker = new TabPicker(filter)

    let downloader = tabPicker.downloader
    let searchFilter = tabPicker.filterer
    
    // FIXME: once again doing this check -- needs to be centralized in some manner
    let chosen_ids = searchFields['facetIds'] ? searchFields['facetIds'] : []
    
    // have to convert to array if it's a single value
    if (typeof chosen_ids === 'string') {
       chosen_ids = [chosen_ids]
    }
 
    // FIXME: could move to searchFields entirely and not have to do this on UI level
    searchFilter.setActiveFacets(chosen_ids)

    // FIXME: this is reproducing search already performed.  As the search gets more
    // complex (facets etc...) this will get more complex
    //
    fetchSearchApi(searchFields, searchFilter, maxRows).then(function(json) {

      let csv = downloader.toCSV(json)
      let blob = new Blob(csv, {type: type})
      // FIXME: much more to do here - just proving I can download a file now
      saveAs(blob, fileName)
 
    })
   
  }
  

  /* FIXME: not using yet - but this is what it might look like
   *
  handleSort() {
    const { search : { searchFields } } = this.props
 
    // FIXME: this same logic appears in many places - it should be centralized
    let filter = searchFields ? (searchFields['filter'] || 'person') : 'person'

    let sort = this.sort

    // 1. add sort to parmams - search etc...
    // setting default start to 0 - so paging is reset
    const query  = {...searchFields, start: 0, sort: sort }

    let tabPicker = new TabPicker(filter)
    let searchFilter = tabPicker.filterer
    
    //
    // 2. run search again 
    dispatch(requestSearch(query, searchFilter))
    
    // NOTE: took me a while to figure out I couldn't just pass
    // searchFields as {query: searchFields} had to copy it (see above)
    this.context.router.push({
      pathname: this.path,
      query: query
    })
    // 3. let display take care of itself - but { sort } needs to be set
    // in some way (for the <select><option value >)
  }
  */

  handleFacetClick(e) {
    const { search : { searchFields }, departments: { data }, dispatch } = this.props

    let query = solr.buildComplexQuery(searchFields)
     
    // FIXME: this same logic appears in many, many places - it should be centralized
    // or defaulted at a higher level, or something
    let filter = searchFields ? (searchFields['filter'] || 'person') : 'person'
    
    let tabPicker = new TabPicker(filter)
    let filterer = tabPicker.filterer

    // NOTE: if I try to wrap this function in _debounce I get 'no property id for null' here
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

    filterer.setActiveFacets(chosen_ids)

    // FIXME: since the action requires the tab -- it's mixing things up a bit
    // it actually requires something that can modify the searcher
    // by applying filters, etc ... which is determined from
    // a) filter query param (e.g. 'tab')
    // b) config items associated with that 'tab'
    // c) any facetIds in query params
    // d) anything else the tab might want to do specific that is 
    //    too complicated to be json config property 
    //
    dispatch(requestSearch(full_query, filterer))
    full_query['facetIds'] = chosen_ids

    this.context.router.push({
      pathname: this.path,
      query: full_query
    })
    
  }

  render() {

    return (
      <section className="search-results">
        <SearchTabs />
        <TabResults onFacetClick={this.handleFacetClick} onDownloadClick={this.handleDownload} />
      </section>

    )
  }

}



const mapStateToProps = (search, ownProps) => {
  return { ...search }
}


export default connect(mapStateToProps)(SearchResults)

