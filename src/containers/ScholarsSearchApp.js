import React, { Component, PropTypes } from 'react'
import Page from '../layouts/page'

import SearchForm from '../components/SearchForm'

import SearchResults from '../components/SearchResults'

import OrganizationSidebar from '../components/OrganizationSidebar'


import actions from '../actions/search'

// NOTE: doing this import and dispatch(fetchOrgs) does NOT work
//import fetchOrgs from '../actions/search'

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

  // FIXME: should I load organzations here and then
  // send down as props? e.g.
  // <OrganizationSidebar organizations=organizations/>
  // NOTE: appInit will add a init.departments to store
  //
  componentDidMount() {
    //this.props.dispatch(actions.fetchOrgs())
    this.props.dispatch(actions.appInit())
  }

/*
  componentWillReceiveProps(nextProps) {
    if (nextProps.userId !== this.props.userId) {
      this.props.dispatch(loadPosts(nextProps.userId))
    }
  }
*/

  constructor(props,context) {
    super(props,context)

  }

  render() {
    return (
      <Page title="Scholars Search">
        <SearchForm />
        <SearchResults />
        { /*<OrganizationSidebar /> */ }
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

