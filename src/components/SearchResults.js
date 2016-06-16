import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { Link } from 'react-router'

/* our stuff */
import actions from '../actions/search'

import PersonDisplay from './PersonDisplay'
import PublicationDisplay from './PublicationDisplay'
import OrganizationDisplay from './OrganizationDisplay'
import GenericDisplay from './GenericDisplay'
import ArtisticWorkDisplay from './ArtisticWorkDisplay'
import SubjectHeadingDisplay from './SubjectHeadingDisplay'
import GrantDisplay from './GrantDisplay'
import CourseDisplay from './CourseDisplay'

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
  }


  handleDownload(e) {
    // NOTE: I get this warning when I used e.preventDefault()
    // This synthetic event is reused for performance reasons. If you're seeing this, you're calling `preventDefault` i
    // on a released/nullified synthetic event. This is a no-op. See https://fb.me/react-event-pooling for more information.
   
    // FIXME: much more to do here - just proving I can download a file now
    const { search : { results, searchFields, isFetching } } = this.props

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

      //var compiled = _.template('hello <%= user %>!');
      //compiled({ 'user': 'fred' });

    let tabPicker = new TabPicker(filter)

    // FIXME: this is a bit like a template - would be different depending
    // on 'filter' (tab)
    fetchSearchApi(searchFields, maxRows).then(function(json) {

      let csv = tabPicker.toCSV(json)

      // switch (filter) {
      //  case person:
      //    
      // }
      // this part would be different, per filter - maybe template?
      //let headers = [`URI\n`]
      //console.log(json.response.docs)
      //let rows = _.map(json.response.docs, function(doc) {
      //  return `${doc.URI}\n`
      //})

      //let csv = _.concat(headers, rows)

      let blob = new Blob(csv, {type: type})
      // FIXME: much more to do here - just proving I can download a file now
      saveAs(blob, fileName)
 
    })
   
    //let csv = _.map(jsonResults, function(r) {
    //  return r.uri
    // })//.join('\n')
    
    //let blob = new Blob(csv, {type: type})
    // FIXME: much more to do here - just proving I can download a file now
    //saveAs(blob, fileName)
  }

  render() {
    const { search : { results, searchFields, isFetching } } = this.props

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

      // NOTE: the diplay changes depending on type e.g.
      // <PublicationDisplay ..
      // <PersonDisplay ..
      // e.g.
      // if filter == 'people' <PersonDisplay ..
      // if filter == 'publication' <PublicationDisplay ..
      // etc...
      
      resultSet = docs.map(doc => { 
          let highlight = highlighting[doc.DocId]
          
          // seems like this needs to be pulled out as a callback-ish thing
          var display = ""
          if (highlight) {
             // NOTE: sometimes doc.type is undefined ... ??
             let docType = doc.type ? doc.type[0] : "?"
             display = highlight.ALLTEXT ? highlight.ALLTEXT[0] : docType
          } else {
            // no highlight -- not sure what to show
            display = ""
          }

          // TabDeterminer.pickDisplay(filter, doc, highlight)
          // TabPicker.pickTemplates(filter)
          //
          // FIXME: factor this out DisplayPicker = or possibly something that also
          // keeps track of download templates too          
          switch(filter) {
            case 'person':
              return <PersonDisplay key={doc.DocId} doc={doc} display={display}/> 
              break
            case 'publications':
              return <PublicationDisplay key={doc.DocId} doc={doc} display={display}/> 
              break
            case 'organizations':  
              return <OrganizationDisplay key={doc.DocId} doc={doc} display={display}/> 
              break
            case 'subjectheadings':  
              return <SubjectHeadingDisplay key={doc.DocId} doc={doc} display={display}/> 
              break
            case 'artisticworks':  
              return <ArtisticWorkDisplay key={doc.DocId} doc={doc} display={display}/> 
              break
            case 'grants':  
              return <GrantDisplay key={doc.DocId} doc={doc} display={display}/> 
              break
            case 'courses':  
              return <CourseDisplay key={doc.DocId} doc={doc} display={display}/> 
              break
            default:  
              return <GenericDisplay key={doc.DocId} doc={doc} display={display}/> 
          }
      })
    }
    else {
      // e.g. if there are no docs - could be fetching, or could just be no
      // search.  So ... add <Loading> just in case.
      return ( 
          <div className="row">
            <Loading isFetching={isFetching}></Loading>
          </div>
      )
      console.log("SearchResults.render() - NO DOCS")
    }

    // NOTE: a textual representation of the complex search
    // right now it is exactly the same as what's actually sent
    // to Solr - which is maybe fine
    let query = solr.buildComplexQuery(searchFields)
    // <h3>Results for group: {numFound} </h3> 
    
    // FIXME: maybe search results should be a product of the tab
    // (since it's always in a tab) - that would get rid of the giant 'switch'
    // statement above
    //
    //
    // FIXME: the sorter - select should be it's own component at least
    // maybe even entire 'row' - download could be too ...
    return (
      <section className="search-results">
        <h3>Query: {query}</h3>
        
        <SearchTabs></SearchTabs>
        
        <div className="search-results-table">
         
          <hr />
          
          <div className="row hidden-xs">
            <div className="col-md-8 col-xs-6">
              
              <button type="button" className="btn btn-default btn-small" onClick={this.handleDownload}>
                <span className="glyphicon glyphicon-download"> Download </span>
              </button>

            </div>
            <div className="col-md-4 col-xs-6">
            {/*
              <div className="pull-right form-inline">
                <div className="form-group">
                  <label>Sort By:</label>
                  <select className="form-control" defaultValue="score"><option value="score">Relevance</option></select>
                </div>
              </div>
              */
            }
            </div>

          </div>
          
          <hr/>
          {resultSet}
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

