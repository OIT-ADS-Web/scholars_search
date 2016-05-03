import React, { Component, PropTypes } from 'react'
//var _ = require('lodash');
// FIXME: should just import function used
import _ from 'lodash'

import Page from '../layouts/page'

import SearchForm from '../components/SearchForm'
import SearchResults from '../components/SearchResults'

import actions from '../actions/search'

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
  static get ChildContext() {
    return {router: this.props.routing}
  }

  // FIXME: maybe this is the wrong place to initialize from routes
  componentDidMount() {
    const { search : { searchFields }, routing: { locationBeforeTransitions }, location, dispatch } = this.props;

    let query = location.query

    console.log("ScholarsSearchApp#componentDidMount")

    // FIXME: not sure if this is a good place for this
    dispatch(actions.appInit())

    // NOTE: was searching if no query parameters in route path, just searching everything
    if (!_.isEmpty(query)) {

      let start = query['start']
      dispatch(actions.fetchSearch(query, start))
      dispatch(actions.fetchTabCounts(query))
      
      // FIXME: how to initialize tab? this sort of works
      dispatch(actions.filterSearch(query['filter'] || 'person'))
    }
  }

  constructor(props,context) {
    super(props,context)
 }

  render() {
    // FIXME: nonoe of these 'props' are used, why get them?
    const { search : { searchFields }, dispatch } = this.props;

    return (

      <Page title="Scholars Search">
        <SearchForm />
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

export default connect(mapStateToProps)(ScholarsSearchApp);

