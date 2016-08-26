import React, { Component, PropTypes } from 'react'
import _ from 'lodash'

import Page from '../layouts/page'

import SearchForm from '../components/SearchForm'
import SearchResults from '../components/SearchResults'

import { requestSearch, requestTabCount, emptySearch, requestDepartments } from '../actions/search'

import solr from '../utils/SolrHelpers'

import TabPicker from '../components/TabPicker'

import { tabList } from '../components/TabPicker'

import querystring from 'querystring'

export class ScholarsSearchApp extends Component {

  // NOTE: had to switch to this so all child components (SearchForm etc...)
  // have the context 'router' - perhaps not strictly necessary though
  static get childContextTypes() {
    return({
      router: PropTypes.object
    })
  }

  //https://facebook.github.io/react/docs/context.html
  //https://medium.com/@skwee357/the-land-of-undocumented-react-js-the-context-99b3f931ff73#.ewo0he7cd
  static get childContext() {
    return {router: this.props.routing}
  }

  onlyAdvanced(query) {
   let flag = (typeof(query['advanced']) != 'undefined'  && _.size(query) == 1)
   return flag
  }

  // FIXME: maybe this is the wrong place to initialize from routes
  componentDidMount() {
    const { location, dispatch } = this.props;

    let query = location.query

    let onlyAdvanced = this.onlyAdvanced(query)
    let blankSearch = solr.isEmptySearch(query)

    dispatch(requestDepartments())

    // NOTE: was searching if no query parameters in route path, just searching everything
    if (!_.isEmpty(query) && !(onlyAdvanced || blankSearch)) {

      // FIXME: I have these kinds of checks all over, would like to have it centralized
      // so don't have to remember to check everywhere
      
      if (!query['start']) {
        query['start'] = 0
      }

      // FIXME: would need to get this from /path - right?
      if (!query['filter']) {
        query['filter'] = 'person'
      }

      let builtSearch = { ...query } 

      // FIXME: a lot of this code is duplicated every time a search is done
      // should centralize a bit more
      
      // FIXME: get the facetQueries here ???
      let tabPicker = new TabPicker(query['filter'])

      let base_query = solr.buildComplexQuery(builtSearch)

      dispatch(requestSearch(builtSearch, tabPicker.tab))
      // NOTE: might need to change - tabs don't need facet_queries
      // but should ignore anyway 
      dispatch(requestTabCount(builtSearch, tabList))

      // getting this.context.router is null here
      /*
      this.context.router.push({
        pathname: "/",
        query: query
      })
      */

    } else if (onlyAdvanced || blankSearch) {
       dispatch(emptySearch())
    }



  }

  constructor(props,context) {
    super(props,context)
  }


  render() {
 
    // {this.props.children}   
    return (

      <Page>
        <SearchForm />
        <SearchResults />
      </Page>
    )
  }

}


import { connect } from 'react-redux'
// https://github.com/reactjs/react-router/blob/master/docs/API.md#route-components
//
// The dynamic segments of the URL.
// NOTE: ownProps.location does NOT give an error here (and here only)
//
const mapStateToProps = (search, ownProps) => {
  return { ...search,
    searchFields: ownProps.location.query,
    typeParam: ownProps.params
  }
}

export default connect(mapStateToProps)(ScholarsSearchApp)

