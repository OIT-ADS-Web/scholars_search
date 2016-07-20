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
    // NOTE: I get this warning when I added (e) as parameter and used e.preventDefault()
    // This synthetic event is reused for performance reasons. If you're seeing this, you're calling `preventDefault` i
    // on a released/nullified synthetic event. This is a no-op. See https://fb.me/react-event-pooling for more information.
    
    console.log("DOWNLOAD")

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
  

  render() {
    const { search : { results, searchFields, isFetching, message } } = this.props

    // FIXME: this same logic appears in many places - it should be centralized
    let filter = searchFields ? (searchFields['filter'] || 'person') : 'person'

    let { highlighting={}, response={} } = results
    let { numFound=0,docs } = response

    let resultSet = ""

    // FIXME: make it so results don't require inside knowledge of SOLR
    // e.g. highlighting [doc.DocId], ALLTEXT etc...
    // these should be wrapped up in SolrQuery class somehow
    //
    // FIXME: need to re-work this slightly to get rid of warnings 
    // (see http://facebook.github.io/react/docs/multiple-components.html#dynamic-children)
    if (docs) {
      let tabPicker = new TabPicker(filter)
      
      resultSet = docs.map(doc => { 
        let highlight = highlighting[doc.DocId]
        return tabPicker.pickDisplay(doc, highlight)
      })
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
          <SearchTabs></SearchTabs>
        </div>

        <div className="search-results-table">
         
          <div className="row panel">
            <div className="col-md-10">          
             {resultSet}
           </div>
            <div className="col-md-2 panel panel-info">
              <div className="panel-body">
                <button type="button" className="btn btn-default btn-small" onClick={this.handleDownload}>
                  <span className="glyphicon glyphicon-download"> Download </span>
                </button>
              </div>
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


export default connect(mapStateToProps)(SearchResults);

