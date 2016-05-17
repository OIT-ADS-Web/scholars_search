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
import Loading from './Loading'
import SearchTabs from './SearchTabs'
import PagingPanel from './PagingPanel'


require('../styles/scholars_search.less');

import solr from '../utils/SolrHelpers'

export class SearchResults extends Component {

  static get contextTypes() {
    return({
        router: PropTypes.object
    })
  }

  constructor(props, context) {
    super(props, context);
  }


  render() {

    // so start should be coming from search object (state)
    const { search : { results, searchFields, start=0, filter, isFetching } } = this.props

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
             display = highlight.ALLTEXT ? highlight.ALLTEXT[0] : doc.type[0]
          } else {
             display = ""
             //display = doc.ALLTEXT[0]
          }
          
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

    return (
      <section className="search-results">
        
        <SearchTabs></SearchTabs>
        <h2>Query: {query}</h2>
        <h3>Results found: {numFound} </h3>
        <div className="search-results-table">
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

