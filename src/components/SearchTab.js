import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

import { requestSearch } from '../actions/search'

import solr from '../utils/SolrHelpers'

import {saveAs} from 'file-saver'

import _ from 'lodash'

import { fetchSearchApi } from '../actions/sagas'

import TabPicker from './TabPicker'

export class SearchTab extends Component {

  // this is necessary to get the router
  static get contextTypes() {
    return({
      router: PropTypes.object
    })
  }

  constructor(props, context) {
    super(props, context)

    this.filter = this.props.filter
    this.active = this.props.active
    this.label = this.props.label
    this.count = this.props.count

    this.matches = this.props.matches

    this.handleTab = this.handleTab.bind(this)
 
    this.handleDownload = this.handleDownload.bind(this)
    //http://stackoverflow.com/questions/23123138/perform-debounce-in-react-js
    this.handleDownload= _.debounce(this.handleDownload,1000);
  
  }

  handleDownload() {
    // NOTE: I get this warning when I added (e) as parameter and used e.preventDefault()
    // This synthetic event is reused for performance reasons. If you're seeing this, you're calling `preventDefault` i
    // on a released/nullified synthetic event. This is a no-op. See https://fb.me/react-event-pooling for more information.
   
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


  handleTab(e) {
    e.preventDefault()
    
    const { search : { searchFields }, dispatch } = this.props

    let filter = this.filter

    // setting default start to 0 - so paging is reset - luckily
    // filter should always be present
    const query  = {...searchFields, start: 0, filter: filter }

    dispatch(requestSearch(query))
    
    // NOTE: took me a while to figure out I couldn't just pass
    // searchFields as {query: searchFields} had to copy it (see above)
    this.context.router.push({
      pathname: '/',
      query: query
    })

  }

  render() {
    let classList = classNames({active: this.active})

    // FIXME: the fact that I can't put an if statement in jsx is annoying    
    if (this.active) {
      return (
         <li className={classList}>
           <a href="#" onClick={this.handleTab}>{this.label} ({this.count}) 
             <span onClick={this.handleDownload} title="Download Search Results" className="glyphicon glyphicon-download pull-right"></span>
            </a>
         </li>
      )
    } else {
      return (
         <li className={classList}>
           <a href="#" onClick={this.handleTab}>{this.label} ({this.count})</a>
         </li>
      )

    }

  }

}

// NOTE: connecting so we can get router and
// searchFields to dispatch etc... the tab is
// initiating a new search
const mapStateToProps = (tabs, ownProps) => {
  return  tabs
}

export default connect(mapStateToProps)(SearchTab)

