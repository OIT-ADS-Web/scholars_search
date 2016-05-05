import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import actions from '../actions/search'
import solr from '../utils/SolrHelpers'

import SearchTab from './SearchTab'

class SearchTabs extends Component {

  constructor(props) {
    super(props)
  }

  
  render() {
     const { search : {filter} } = this.props
     const { tabs : {grouped, isFetching } } = this.props

     const tabList = solr.tabList

     // NOTE: made it into an array so order would be preserved
     let tabs = _.map(tabList, (tab) => {
      
      // if we're still fetching - there will be nothing in 'grouped' to pull counts from
      if (isFetching) {
        return <div></div>
      }

      // get the count - default to 0 just in case something wrong
      let count = tab.filter in grouped ? grouped[tab.filter].doclist.numFound : 0
      let label = tab.label
      return <SearchTab key={tab.id} filter={tab.id} active={filter == tab.id} label={tab.label} count={count}/>

    })

    return (
        <ul className="nav nav-pills">
          {tabs}
        </ul>

      )
  }

}

const mapStateToProps = (tabs) => {
  return tabs
}


export default connect(mapStateToProps)(SearchTabs)

