import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import actions from '../actions/search'
import solr from '../utils/SolrHelpers'

import SearchTab from './SearchTab'

export class SearchTabs extends Component {

  constructor(props) {
    super(props)
  }

  
  render() {
     const { search : {searchFields} } = this.props
 
     // FIXME: seems like I shouldn't default filter in this place - 
     // e.g. it should be more global
     let filter = searchFields ? searchFields['filter'] : 'person'

     const { tabs : {grouped, isFetching } } = this.props

     const tabList = solr.tabList

     // note: every group has this - we only need one though
     var ungroupedCount = 0
    
     // matches - gives total matches ---
     //
     // NOTE: made it into an array so order would be preserved
     let tabs = _.map(tabList, (tab) => {
      
      // if we're still fetching - there will be nothing in 'grouped' to pull counts from
      if (isFetching) {
        return <div></div>
      }

      // get the count - default to 0 just in case something wrong
      //let matches = 0

      let matches = tab.filter in grouped ? grouped[tab.filter].matches : 0
      let count = tab.filter in grouped ? grouped[tab.filter].doclist.numFound : 0
      let label = tab.label
      
      ungroupedCount = matches

      return <SearchTab key={tab.id} filter={tab.id} active={filter == tab.id} label={tab.label} count={count} matches={matches}/>

    })

    return (
        <div>
          <h4>Total Found: {ungroupedCount}</h4>
          <ul className="nav nav-pills">
            {tabs}
          </ul>
        </div>

      )
  }

}

const mapStateToProps = (tabs) => {
  return tabs
}


export default connect(mapStateToProps)(SearchTabs)

