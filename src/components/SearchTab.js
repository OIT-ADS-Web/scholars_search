import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

import querystring from 'querystring'

import { requestSearch } from '../actions/search'

import solr from '../utils/SolrHelpers'

import {saveAs} from 'file-saver'

import _ from 'lodash'

import { fetchSearchApi } from '../actions/sagas'

import TabPicker from './TabPicker'

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

    this.mobile = this.props.mobile || false

    this.handleTab = this.handleTab.bind(this)
  }


  handleTab(e) {
    e.preventDefault()
    
    const { search : { searchFields }, dispatch } = this.props

    let filter = this.filter

    // setting default start to 0 - so paging is reset - luckily
    // filter should always be present
    const query  = {...searchFields, start: 0, filter: filter }

    // FIXME: needs to do this on default search (from URL) too
    // FIXME: is this a good place for adding facet - counts etc...
    let tabPicker = new TabPicker(filter)

    let base_query = solr.buildComplexQuery(searchFields)

    let full_query = { ...query }
    
    dispatch(requestSearch(full_query, tabPicker.tab))
 
    // NOTE: took me a while to figure out I couldn't just pass
    // searchFields as {query: searchFields} had to copy it (see above)
    this.context.router.push({
      pathname: '/',
      query: full_query
    })

  }

  render() {
    
    let classList = classNames({active: this.active, 'search-tab': !this.mobile})

    // FIXME: the fact that I can't put an if statement in jsx is annoying    
    return (
         <li className={classList}>
           <a href="#" onClick={this.handleTab}>{this.label} ({this.count}) </a>
         </li>
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

