import React, { Component, PropTypes } from 'react'
//import { findDOMNode } from 'react-dom';
import Page from '../layouts/page'
//import * from '../actions/search'

import SearchForm from '../components/SearchForm'

// export class directly for unit testing of this component
// 'import { Dashboard }' will get the unwrapped component
export class ScholarsSearchApp extends Component {
  // NOTE: this allows getting the ownProps --> location (see way below)
  //
  static get contextTypes() {
    return({
        router: PropTypes.object
    })
  }

  constructor(props,context) {
    super(props,context)
  }

  render() {
    return (
      <Page title="Scholars Search">
        <SearchForm />
      </Page>
    )
  }

}


ScholarsSearchApp.propTypes = {
  searchParams: PropTypes.object
}

// import react-redux helper to create a wrapped  Dashboard that
// can be connected to a store
import { connect } from 'react-redux'
// make a function that maps the stores state to the props
// of our top-level component, anything goes here, just return
// and object and use the state as you see fit.
// get greeting from query params now that we have routes
const mapStateToProps = (state, ownProps) => {
  return {
    searchParams: ownProps.location.query
  }
}

// wrap the dashboard componet with redux functions
// standared imports will get this 'connected' component
export default connect(mapStateToProps)(ScholarsSearchApp);

