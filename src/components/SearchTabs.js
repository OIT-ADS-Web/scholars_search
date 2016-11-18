import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import solr from '../utils/SolrHelpers'

import SearchTab from './SearchTab'
import Loading from './Loading'
import ErrorHappened from './ErrorHappened'

import { requestSearch } from '../actions/search'

import { toggleFacets } from '../actions/search'

import { tabList } from './TabPicker'

export class SearchTabs extends Component {

  // this is necessary to get the router
  static get contextTypes() {
    return({
      router: PropTypes.object
    })
  }


  constructor(props) {
    super(props)
    
    this.handleShowMobileFacets = this.handleShowMobileFacets.bind(this)
  }


  // FIXME: wow - don't like this at all (even though I wrote it!)
  // the tabs are actually different DOM-wise depending on screen size though
  // 
  // The application should be able to decide what javascript/dom/css (since they are all javascript anyway)
  // to apply to a given media size (instead of using css to show/hide)
  // maybe use this:  https://www.npmjs.com/package/react-match-media ??
  desktopTabs(isFetching, grouped, filter) {
    let tabs = _.map(tabList, (tab) => {
      
      // if we're still fetching - there will be nothing in 'grouped' to pull counts from
      if (isFetching) {
        return <div></div>
      }

      // http://stackoverflow.com/questions/432493/how-do-you-access-the-matched-groups-in-a-javascript-regular-expression
       
      // NOTE: had to do this so I can add arbitary text (like a big NOT, OR statement) to group.query, but not 
      // have to use that exact same text to match the 'tab'
      let tagMatch = /^{!tag=(.*?)}/
      
      // so now group by the tag, not the group.query
      let regrouped = {}
      _.forEach(grouped, function(value, key) {
          let match = tagMatch.exec(key)
          regrouped[match[1]] = value
      })
      
      // find it by the id - so the {tag} and the tab.id - have to match 
      let count = tab.id in regrouped ? regrouped[tab.id].doclist.numFound : 0

      return <SearchTab key={tab.id} filter={tab.id} active={filter == tab.id} label={tab.label} count={count} />

    })

    return tabs
  }

  // FIXME: see above - this ends up rendering tabs twice - and show/hide depending on screen-size
  mobileTabs(isFetching, grouped, filter) {
    if (isFetching) {
      return <div></div>
    }
      
    let index = _.findIndex(tabList, function(o) { return o.id == filter })
    
    let currentTab = tabList[index]
    
    let count = currentTab.filter in grouped ? grouped[currentTab.filter].doclist.numFound : 0
    let label = currentTab.label
           
    let rows = []
    
    _.forEach(tabList, function(value) {
      if (value.id != filter) {

        let count = value.filter in grouped ? grouped[value.filter].doclist.numFound : 0
        let label = value.label

        let row = (
          <SearchTab key={value.id} filter={value.id} active={filter == value.id} label={label} count={count} mobile={true} />
        )
        rows.push(row)
      }   
    })

    return (

      <div className="btn-group">
        <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        {label} ({count}) <span className="caret"></span>
        </button>
        <ul className="dropdown-menu">
          {rows}          
        </ul>
      </div>

   )

  }

  handleShowMobileFacets(e) {
    e.preventDefault();
    const { dispatch } = this.props
    
    dispatch(toggleFacets())
  
  }


  render() {
    const { search : {searchFields} } = this.props
 
    // FIXME: seems like I shouldn't have to default filter in this place - 
    // I'd like it more global because - these types of lines are in multiple
    // places - feels too redundant
    let filter = searchFields ? searchFields['filter'] : 'person'

    const { tabs : {grouped, isFetching, message } } = this.props

    // FIXME: why is filter getting all the way here as 'undefined' --  
    // sometimes? have not figured that out
    if (isFetching || typeof(filter) == 'undefined' ) { 
      return ( 
          <div className="row">
            <Loading isFetching={isFetching}></Loading>
          </div>
      )
    }
 
    if (message) { 
      return (
        <ErrorHappened message={message}></ErrorHappened>
      )
    }
 
    let first = _.head(tabList)

    // NOTE: the group query does return a total matches # (see below)
    //let ungroupedCount = first.filter in grouped ? grouped[first.filter].matches : 0
    
    // but if the filters of each tab are not all inclusive, the count will
    // be off slighgtly - so this is just manually adding them ...
    let ungroupedCount = 0
    
    _.forEach(grouped, function(value, key) {
      ungroupedCount += value.doclist.numFound
    })

    let desktopTabs = this.desktopTabs(isFetching, grouped, filter)
    let mobileTabs = this.mobileTabs(isFetching, grouped, filter)

    let query = solr.buildComplexQuery(searchFields)

    const { facets: {showFacets} } = this.props
 
    let facetText = showFacets ? '&laquo; Hide Filters' : 'Filters &raquo;'

    return (
      <div>
        <div className="pull-right">
          <span className="search-text">
          Query: {query} found {ungroupedCount} results
          </span>
        </div>
        <div className="clearfix"></div>
        <nav className="visible-xs">
            {mobileTabs} 
            <span className="pull-right">
              <a href="#" className="btn btn-primary" onClick={this.handleShowMobileFacets}>
              <span dangerouslySetInnerHTML={{__html: facetText}}></span>
              </a>
            </span>           
        </nav>
        
        <nav className="hidden-xs">
          <ul className="nav nav-pills nav-justified">
            {desktopTabs}
          </ul>
 
        </nav>

      </div>

    )
  }

}

const mapStateToProps = (tabs) => {
  return tabs
}


export default connect(mapStateToProps)(SearchTabs)

