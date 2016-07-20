import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import solr from '../utils/SolrHelpers'

import SearchTab from './SearchTab'
import Loading from './Loading'

import { requestSearch } from '../actions/search'

import { tabList } from '../tabs'

export class SearchTabs extends Component {

  // this is necessary to get the router
  static get contextTypes() {
    return({
      router: PropTypes.object
    })
  }


  constructor(props) {
    super(props)
  }


  handleTab(e, theTab) {
    e.preventDefault()

    const { search : { searchFields }, dispatch } = this.props

    let filter = theTab.id

    // setting default start to 0 - so paging is reset - luckily
    // filter should always be present
    const query  = {...searchFields, start: 0, filter: filter }

    dispatch(requestSearch(query))
    
    // NOTE: took me a while to figure out I couldn't just pass
    // searchFields as {query: searchFields} had to copy it into 'query' (see above)
    this.context.router.push({
      pathname: '/',
      query: query
    })

    return false
  }
  

  // FIXME: wow - don't like this at all (even though I wrote it)
  // the tabs are actually different DOM-wise depending on screen size though
  // 
  // The application should be able to decide what javascript/dom/css 
  // (since they are all javascript anyway)
  // to apply to a given media size (instead of using css to show/hide)
  // https://www.npmjs.com/package/react-match-media ??
  desktopTabs(isFetching, grouped, filter) {
    let tabs = _.map(tabList, (tab) => {
      
      // if we're still fetching - there will be nothing in 'grouped' to pull counts from
      if (isFetching) {
        return <div></div>
      }

      let matches = tab.filter in grouped ? grouped[tab.filter].matches : 0
      let count = tab.filter in grouped ? grouped[tab.filter].doclist.numFound : 0
      
      return <SearchTab key={tab.id} filter={tab.id} active={filter == tab.id} label={tab.label} count={count} matches={matches}/>

    })

    return tabs
  }

  mobileTabs(isFetching, grouped, filter) {
    if (isFetching) {
      return <div></div>
    }
      
    let index = _.findIndex(tabList, function(o) { return o.id == filter })
    let currentTab = tabList[index]

    let count = currentTab.filter in grouped ? grouped[currentTab.filter].doclist.numFound : 0
    let label = currentTab.label
           
    //  NOTE: tabList looks like this:
    // export const tabList = [
    //  { id: "person", filter: "type:(*Person)", label: "People" },
    // ...
    // ]

    let rows = []
    let _self = this
    _.forEach(tabList, function(value) {
      if (value.id != filter) {

        let count = value.filter in grouped ? grouped[value.filter].doclist.numFound : 0
        let label = value.label
 
        let row = (
          <li key={value.id}><a href="#" onClick={(e) => _self.handleTab(e, value)}>{label} ({count})</a></li>
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

  render() {
    const { search : {searchFields} } = this.props
 
    // FIXME: seems like I shouldn't default filter in this place - 
    // e.g. it should be more global - these types of lines are in multiple
    // places
    let filter = searchFields ? searchFields['filter'] : 'person'

    // FIXME: getting message here (which would mean error) but doing
    // nothing at the moment
    const { tabs : {grouped, isFetching, message } } = this.props

    if (isFetching) { 
      return ( 
          <div className="row">
            <Loading isFetching={isFetching}></Loading>
          </div>
      )
    }
 
    let first = _.head(tabList)
    // NOTE: every group has matches value, doesn't matter which one we take
    let ungroupedCount = first.filter in grouped ? grouped[first.filter].matches : 0

    let desktopTabs = this.desktopTabs(isFetching, grouped, filter)
    let mobileTabs = this.mobileTabs(isFetching, grouped, filter)

    // FIXME: what to do if tabs error? e.g. if (message) { }
 
    return (
      <div>
        <div className="pull-right"><strong>Total Found: {ungroupedCount}</strong></div>
        <div className="clearfix"></div>
        <nav className="visible-xs">
            {mobileTabs}            
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

