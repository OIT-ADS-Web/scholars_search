//import React, { Component, PropTypes } from 'react';
//import { connect } from 'react-redux';
//import { fetchSearch } from '../actions';

//import SearchBox from '../components/SearchBox';
//import SearchResults from '../components/SearchResults';

//class ScholarsSearchApp extends Component {
//
//  constructor(props) {
//    super(props);
//  }
//
//  render() {
//    return (
//      <div>
//      </div>
//    );
//  }
//}


/*
function mapStateToProps(state) {
  const { search } = state;
  return {
    search
  };
}

export default connect(mapStateToProps)(MainApp);a


*/

import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom';
import Page from '../layouts/page'
import actions from '../actions/search'

import SearchFrom from '../components/SearchForm'

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
// import react-redux helper to create a wrapped  Dashboard that
// can be connected to a store
import { connect } from 'react-redux'
// make a function that maps the stores state to the props
// of our top-level component, anything goes here, just return
// and object and use the state as you see fit.
// get greeting from query params now that we have routes
const mapStateToProps = (state, ownProps) => {
  return {
    //displayMessage: state.displayMessage,
    //greeting: ownProps.location.query.greeting
  }
}

// wrap the dashboard componet with redux functions
// standared imports will get this 'connected' component
export default connect(mapStateToProps)(ScholarsSearchApp);

