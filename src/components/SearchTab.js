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

    // getting from tab
    //let facetQueries = tabPicker.facetQueries(base_query)
    //let filterQueries = tabPicker.filterQueries(base_query)
    //let facetFields = tabPicker.facetFields()
 
    // FIXME: a little confusing having two copies here, the first one
    // is to dispatch() the second one is to add to params
    //
    let full_query = { ...query }
    
    const freeze_query = { ...query }
 
    // remove/reset filters whenever we go to a new tab
    //delete full_query['filter_queries'] 
  
    // if tab has facet queries, add them to the query
    //if (facetQueries) {
    //  let gathered = _.map(facetQueries, 'query')
    //  let facetQueryStr = querystring.stringify(gathered)
    //
    //  full_query['facet_queries'] = facetQueryStr
    //}
    
    //if(facetFields) {
    //  full_query['facet_fields'] = facetFields
    //}

    // add anythign with applyFilters ...
    // let tab = tabpicker.tab
    //
    // dispatch(requestSearch(query, filterer=tab))
    //
    dispatch(requestSearch(full_query, tabPicker.tab))
 
    // doing this to KEEP OUT of query_url (for now)  
    // just made a second copy to be clear they have different purposes
    // could probably do
    // delete full_query['facet_queries']
    
    // NOTE: I thought making 'const' would mean this is not necessary
    //
    //delete freeze_query['filter_queries']
    //delete freeze_query['facet_queries']
    //delete freeze_query['facet_fields']

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

