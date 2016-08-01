import React, { Component, PropTypes } from 'react'
import _ from 'lodash'

import Page from '../layouts/page'

import SearchForm from '../components/SearchForm'
import SearchResults from '../components/SearchResults'

import { requestSearch, requestTabCount, emptySearch } from '../actions/search'

import solr from '../utils/SolrHelpers'

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

    // NOTE: was searching if no query parameters in route path, just searching everything
    if (!_.isEmpty(query) && !(onlyAdvanced || blankSearch)) {

      // FIXME: I have these kinds of checks all over, would like to have it centralized
      // so don't have to remember to check everywhere
      
      if (!query['start']) {
        query['start'] = 0
      }
      if (!query['filter']) {
        query['filter'] = 'person'
      }

      let builtSearch = { ...query } 
      
      dispatch(requestSearch(builtSearch))
      // NOTE: might need to change 
      dispatch(requestTabCount(builtSearch))
 
    } else if (onlyAdvanced || blankSearch) {
       dispatch(emptySearch())
    }


  }

  constructor(props,context) {
    super(props,context)
  }

  render() {
    
    return (

      <Page>
        <SearchForm />
        { /* 
            <SearchTabs />
            <SelectedTab />

          */ 
        }
        <SearchResults />
      </Page>
    )
  }

}


import { connect } from 'react-redux'
//https://github.com/reactjs/react-router/blob/master/docs/API.md#route-components
//
//The dynamic segments of the URL.
// NOTE: ownProps.location does NOT give an error here (and here only)
//
const mapStateToProps = (search, ownProps) => {
  return { ...search,
    searchFields: ownProps.location.query,
    typeParam: ownProps.params
  }
}

export default connect(mapStateToProps)(ScholarsSearchApp)

