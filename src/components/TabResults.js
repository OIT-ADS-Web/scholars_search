import React, { Component, PropTypes } from 'react'

import { connect } from 'react-redux';

import PagingPanel from './PagingPanel'
import TabPicker from './TabPicker'
import { defaultTab } from './TabPicker'

import Loading from './Loading'
import ErrorHappened from './ErrorHappened'

import classNames from 'classnames'

class EmptyResults extends Component {
  
  constructor(props) {
    super(props)
  }

  render () {
    return (
        <div className="search-result-table">
            <div className="row panel">
              <div className="col-md-12 col-sm-12">
                {this.props.children}
              </div>
            </div>
        </div>
        )
   }
}

class TabResults extends Component {

  static get contextTypes() {
    return({
      router: PropTypes.object
    })
  }

  constructor(props) {
    super(props)

    this.onFacetClick = this.props.onFacetClick
    this.handleDownload = this.props.onDownloadClick

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
    } else if (timeElapsed > 10000) {
      return true
    } else {
      return true
    }
    
  }
 
  render() {
    const { search : { results, searchFields, isFetching, message }, departments: { data } } = this.props

    let filter = defaultTab(searchFields)

    let { highlighting={}, response={}, facet_counts={} } = results
    let { numFound=0,docs } = response
    let { facet_queries, facet_fields } = facet_counts
    
    let tabPicker = new TabPicker(filter)

    let displayer = tabPicker.displayer
    //
    let tabResults = ""

    if (docs) {
      tabResults = displayer.results(docs, highlighting)
    }
    else {
      // e.g. if there are no docs - could be fetching, or could just be no
      // search.  So ... add <Loading> just in case.
      // FIXME: what to do if search error? e.g. if (message) { }
      return ( 
        <EmptyResults>
          <Loading isFetching={isFetching}></Loading>
        </EmptyResults>
      )
    }


    // FIXME: not crazy about this way of catching various situations (error, not results, etc...)
    if (message) {

      return ( 
        <EmptyResults>
          <ErrorHappened message={message}></ErrorHappened>
        </EmptyResults>
      ) 
    }
    
    if (numFound == 0) {

      return (
          <EmptyResults>
            <div className="alert alert-info search-results-info">No matching results found in this category.</div>
          </EmptyResults>
      )
    }

     
    let chosen_facets = searchFields['facetIds'] ? searchFields['facetIds'] : []
    
    // FIXME: it's annoying having this boilerplate check everywhere we get the chosen facets
    // might be worth checking if it's necessary in this particular place
    if (typeof chosen_facets === 'string') {
      chosen_facets = [chosen_facets]
    }

    let tabFacets = ""

    // FIXME: need a way to map facetIds to actual facet values
    //
    if (facet_fields && numFound > 0) {   
      tabFacets = displayer.facetDisplay(facet_counts, chosen_facets, this.onFacetClick, data)
    }

    let tabDownload = ""

    tabDownload =  (               
       <div className="panel-body text-center">
        <button type="button" className="btn btn-primary btn-small" onClick={this.handleDownload}>
            <span>Download results</span>
        </button> 
       </div>
    )

    const { facets: {showFacets} } = this.props
    
    let facetClasses = classNames({'hidden-sm': !showFacets, 'hidden-xs': !showFacets})

    // facet-wrapper = classNames(
    // NOTE: columns are in reverse order - so push/pull will put facets on top in mobile view
    return (
           
       <div className="search-results-table">
         
          <div className="row panel">

            <div className="col-md-3 col-md-push-9 panel panel-info">
              
              <span id="facet-wrapper" className={facetClasses}>
              {tabFacets}
              </span>
              
              <span id="download-wrapper" className="hidden-sm hidden-xs">
              {tabDownload}
              </span>
            </div>


            <div className="col-md-9 col-md-pull-3">          
              {tabResults} 
            </div>

          </div>
        
          <PagingPanel />
 
        </div>

    )
  }

}

 
const mapStateToProps = (search, ownProps) => {
  return { ...search }
}


export default connect(mapStateToProps)(TabResults)

