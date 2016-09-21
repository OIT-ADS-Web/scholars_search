import React, { Component, PropTypes } from 'react'

import { connect } from 'react-redux';

import PagingPanel from './PagingPanel'
import TabPicker from './TabPicker'
import Loading from './Loading'

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

    // FIXME: this same logic appears in many places - it should be centralized
    let filter = searchFields ? (searchFields['filter'] || 'person') : 'person'

    let { highlighting={}, response={}, facet_counts={} } = results
    let { numFound=0,docs } = response
    let { facet_queries, facet_fields } = facet_counts
    
    let tabPicker = new TabPicker(filter)
    let tab = tabPicker.tab

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
      console.log("SearchResults.render() - NO DOCS")
      return ( 
        <div className="row">
          <Loading isFetching={isFetching}></Loading>
        </div>
      )
    }

    
    let chosen_facets = searchFields['facetIds'] ? searchFields['facetIds'] : []
    
    // FIXME: it's annoying having this boilerplate check everywhere we get the chosen facets
    // might be worth checking if it's necessary in this particular place
    if (typeof chosen_facets === 'string') {
      chosen_facets = [chosen_facets]
    }

    // FIXME: don't like having to remember to call this - if we added PeopleTab as
    // a 'connected' component, there would be no need (I think)
    //tab.setActiveFacets(chosen_facets)
 
    let tabFacets = ""

    if (facet_fields) {   
      tabFacets = displayer.facetDisplay(facet_counts, chosen_facets, this.onFacetClick, data)
    }

     let tabDownload =  (               
       <div className="panel-body text-center">
        <button type="button" className="btn btn-primary btn-small" onClick={this.handleDownload}>
            <span>Download results</span>
        </button> 
       </div>
     )
    
    return (
           
       <div className="search-results-table">
         
          <div className="row panel">
            <div className="col-md-9">          
              
              {tabResults} 
            
            </div>
            <div className="col-md-3 panel panel-info">
             
              {tabFacets}
              {tabDownload}
           
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

