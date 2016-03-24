import React, { Component, PropTypes } from 'react'
import Page from '../layouts/page'

import SearchForm from '../components/SearchForm'

import SearchResults from '../components/SearchResults'

import OrganizationSidebar from '../components/OrganizationSidebar'

import fetchOrgs from '../actions/search'
import loadOrganizationsIfNeeded from '../actions/search'
 
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


  http://stackoverflow.com/questions/26632415/where-should-ajax-request-be-made-in-flux-app
  https://facebook.github.io/react/tips/initial-ajax.html

  componentDidMount: function() {
    this.serverRequest = $.get(this.props.source, function (result) {
      var lastGist = result[0];
      this.setState({
        username: lastGist.owner.login,
        lastGistUrl: lastGist.html_url
      });
    }.bind(this));
  },

  componentWillUnmount: function() {
    this.serverRequest.abort();
  },


  };
  }

  */

  // FIXME: should I load organzations here and then
  // send down as props? e.g.
  // <OrganizationSidebar organizations=organizations/>

  constructor(props,context) {
    super(props,context)
    // FIXME: can't get this to work so far, just
    // trying to load organization at init time
    //this.props.dispatch(loadOrganizationsIfNeeded())
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



//{
// organizaitons: search.organizations
// }
//
// export function loadOrganizationsIfNeeded() {
 
// NOTE: I don't believe this actually has to be called mapStateToProps
// techincally, it's just the convention
const mapStateToProps = (search, ownProps) => {
  return { ...search,
    searchParams: ownProps.location.query,
    typeParam: ownProps.params
  }
}

// wrap the search component with redux functions
// standared imports will get this 'connected' component
export default connect(mapStateToProps)(ScholarsSearchApp);

