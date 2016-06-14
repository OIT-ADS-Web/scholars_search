import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

import actions from '../actions/search'

//import * from '../actions/types' as types
import * as types from '../actions/types'

import { requestSearch, requestFilter } from '../actions/search'

export class SearchTab extends Component {

  // this is necessary to get the router
  static get contextTypes() {
    return({
        router: PropTypes.object
     })
  }

  constructor(props, context) {
    super(props, context)

    this.filter = this.props.filter
    this.active = this.props.active
    this.label = this.props.label
    this.count = this.props.count

    this.matches = this.props.matches

    this.handleTab = this.handleTab.bind(this)
  
  }

  handleTab(e) {
    e.preventDefault()
    
    const { search : { results, searchFields }, dispatch } = this.props

    let filter = this.filter

    // setting default start to 0 - so paging is reset - luckily
    // filter should always be present
    const query  = {...searchFields, start: 0, filter: filter }

    dispatch(requestSearch(query))
    
    // NOTE: took me a while to figure out I couldn't just pass
    // searchFields as {query: searchFields} had to copy it (see above)
    this.context.router.push({
      pathname: '/',
      query: query
    })

  }

  render() {
    let classList = classNames({active: this.active})
      
    return (
       <li className={classList}><a href="#" onClick={this.handleTab}>{this.label} ({this.count})</a></li>
    )

  }

}

// NOTE: connecting so we can get router and
// searchFields to dispatch etc... the tab is
// initiating a new search
const mapStateToProps = (tabs, ownProps) => {
  return  tabs
}

export default connect(mapStateToProps)(SearchTab)
