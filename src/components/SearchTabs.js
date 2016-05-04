import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
//import classNames from 'classnames'
import _ from 'lodash'

import actions from '../actions/search'

// FIXME: we don't want to do the actual SolrQuery here,
// so this should be something more like
// import solr from '../SolrConfig' e.g. site specific
// utils and such - in this case filter list
import solr from '../utils/SolrQuery'

import SearchTab from './SearchTab'

class SearchTabs extends Component {

  constructor(props) {
    super(props)
  }

  
  render() {
     const { search : {filter} } = this.props
     const { tabs : {grouped, isFetching } } = this.props

     const filterConfig = solr.filterConfig

     // FIXME: is iteration order preserved? seems to be
     // but I don't know why
     let tabs = _.map(filterConfig, (value, key) => {
      
      // if we're still fetching - there will be nothing in 'grouped' to pull counts from
      if (isFetching) {
        return <div></div>
      }

      // get the count - default to 0 just in case something wrong
      let count = value.filter in grouped ? grouped[value.filter].doclist.numFound : 0
      let label = value.label
      return <SearchTab key={key} filter={key} active={filter == key} label={label} count={count}/>

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

