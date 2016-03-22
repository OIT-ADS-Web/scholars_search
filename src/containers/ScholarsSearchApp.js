import React, { Component, PropTypes } from 'react'
import Page from '../layouts/page'

import SearchForm from '../components/SearchForm'

import SearchResults from '../components/SearchResults'

import OrganizationSidebar from '../components/OrganizationSidebar'


// export class directly for unit testing of this component
// 'import { ScholarsSearchApp }' will get the unwrapped component
export class ScholarsSearchApp extends Component {
  // NOTE: this allows getting the ownProps --> location (see way below)
  //
  static get contextTypes() {
    return({
        router: PropTypes.object
    })
  }

  /*
  static get childContextTypes() {
    return ({
         router: PropTypes.object
     })
  }

    getChildContext: function() {
         return { bar: "I am the parent" };
    },
  */

  constructor(props,context) {
    super(props,context)
  }

  render() {
    return (
      <Page title="Scholars Search">
        <SearchForm />
        <SearchResults />
        <OrganizationSidebar />
      </Page>
    )
  }

}


ScholarsSearchApp.propTypes = {
  searchParams: PropTypes.object
}

// import react-redux helper to create a wrapped ScholarsSearchApp that
// can be connected to a store
import { connect } from 'react-redux'
// make a function that maps the stores state to the props
// of our top-level component, anything goes here, just return
// and object and use the state as you see fit.

//
//https://github.com/reactjs/react-router/blob/master/docs/API.md#route-components
//
//params

//The dynamic segments of the URL.


const mapStateToProps = (state, ownProps) => {
  return {
    searchParams: ownProps.location.query,
    typeParam: ownProps.params//,
    //isFetching: state.isFetching
  }
}

// wrap the search component with redux functions
// standared imports will get this 'connected' component
export default connect(mapStateToProps)(ScholarsSearchApp);

