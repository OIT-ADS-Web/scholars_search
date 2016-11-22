import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import ReactDOM from 'react-dom'

import {saveAs} from 'file-saver'
import querystring from 'querystring'
import _ from 'lodash'

import SearchTabs from './SearchTabs'
import TabResults from './TabResults'
import TabPicker from './TabPicker'

import { defaultTab, defaultChosenFacets } from './TabPicker'

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

    let filter = defaultTab(searchFields)

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
 
    let filter = defaultTab(searchFields)

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

  handleFacetClick(e, assigned_id, is_selected, value) {
    const { search : { searchFields }, departments: { data }, dispatch } = this.props

    let query = solr.buildComplexQuery(searchFields)
     
    let filter = defaultTab(searchFields)

    let tabPicker = new TabPicker(filter)
    let filterer = tabPicker.filterer
    
    // NOTE: I used to use assigned_id to look up stuff, but switched to value
    // that's why the 'new_assigned_id' name
    let id = assigned_id
    let prefix = assigned_id.substr(0, assigned_id.indexOf("_"))
    let new_assigned_id = `${prefix}_${value}`

    let full_query = { ...searchFields }
    full_query['start'] = 0

    let chosen_ids = defaultChosenFacets(searchFields)
 
    if (is_selected) {
      chosen_ids.push(new_assigned_id)  // need way to map id to value
    } else {
      chosen_ids = _.filter(chosen_ids, function(o) { return o != new_assigned_id })
    }

    full_query['facetIds'] = chosen_ids

    // NOTE: since the action (facetClick) requires a tab -- it's perhaps in the
    // wrong place since it requires something that can modify the searcher
    // by applying filters, etc ... which is determined from:
    // 
    // a) filter query param (e.g. 'tab')
    // b) config items associated with that 'tab'
    // c) any facetIds in query params
    // d) anything else the tab might want to do specific that is 
    //    too complicated to be json config property 
    //
    dispatch(requestSearch(full_query, filterer))

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

