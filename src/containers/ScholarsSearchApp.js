import React, { Component, PropTypes } from 'react'
import Page from '../layouts/page'

import SearchForm from '../components/SearchForm'
import SearchResults from '../components/SearchResults'

//import OrganizationSidebar from '../components/OrganizationSidebar'

import actions from '../actions/search'

export class ScholarsSearchApp extends Component {
  // NOTE: this allows getting the ownProps --> location (see way below)
  //
  //
  //static get contextTypes() {
  //  return({
  //      router: PropTypes.object
  //  })
  //}

  static get childContextTypes() {
    return({
      router: PropTypes.object
    })
  }

  //https://facebook.github.io/react/docs/context.html
  //https://medium.com/@skwee357/the-land-of-undocumented-react-js-the-context-99b3f931ff73#.ewo0he7cd
  //

  static get ChildContext() {
    console.log("ScholarsSearchApp#getChildContext")
    console.log(this.props)

    return {router: this.props.routing}
  }

  // FIXME: maybe this is the wrong place to initialize from routes
  componentDidMount() {
    //const { search : { searchFields, start, filter }, dispatch } = this.props;
    const { search : { searchFields }, routing: { locationBeforeTransitions }, location, dispatch } = this.props;

    console.log(this.props)

    //if (type !== this.state.type){
    //   this.setState({type:type}); 
    // }

    // FIXME: this seems way wrong
    //let query = locationBeforeTransitions.query
    let query = location.query

    console.log("ScholarsSearchApp#componentDidMount")
    console.log(query)

    // undefined
    //console.log(searchFields)

    // undefined
    //console.log(this.location)


    // how to get searchFields in here?
    //
    
    // FIXME: not sure if this is a good place for this
    dispatch(actions.appInit())
    
    // NOTE: if I add 'filter' that causes errors 
    //
    //dispatch(actions.fetchSearch(searchFields, start))
    if (query) {
      let start = query['start']
      dispatch(actions.fetchSearch(query, start))
      dispatch(actions.fetchTabCounts(query))

      // FIXME makes it down to page of tab - but fails there

      // this causes error
      //this.context.router.push({
      //  pathname: '/',
      //  query: query
      //})



    }
    //dispatch(actions.fetchTabCounts(searchFields))

    //console.log(`QUERY=${searchFields}`)
  }

  constructor(props,context) {
    super(props,context)
 }

  render() {
    //const { search : { searchFields, start }, dispatch } = this.props;
    //const { init : { searchFields }, dispatch } = this.props;

    const { search : { searchFields }, routing: { locationBeforeTransitions }, dispatch } = this.props;

    //console.log(`SearchForm#render()****`)
    //console.log(locationBeforeTransitions)

    // FIXME: this seems way wrong
    let query = locationBeforeTransitions.query

    console.log("ScholarsSearchApp#render")
    //console.log(this.context.router)
 
    console.log(query)


    console.log("ScholarsSearchApp#render")

    // undefined
    //console.log(this.location)
    // undefined
    //console.log(searchFields)

    // FIXME: do I need to send 'location' as a prop?  It's still undefined
    return (

      <Page title="Scholars Search">
        <SearchForm />
        <SearchResults />
      </Page>
    )
  }

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
// NOTE: ownProps.location does NOT give an error here (and here only)
//
const mapStateToProps = (search, ownProps) => {
  return { ...search,
    searchFields: ownProps.location.query,
    typeParam: ownProps.params
  }
}

// wrap the search component with redux functions
// standared imports will get this 'connected' component
export default connect(mapStateToProps)(ScholarsSearchApp);

