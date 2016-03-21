import React, { Component, PropTypes } from 'react'
import actions from '../actions/search'

require('../styles/forms.less');

import SearchResults from './SearchResults'
//
// all words = ( word AND word .. )   
// exact match = " word phrase "
// at least one = ( word OR word ..)
// no match = NOT word
//  NOTE: NOT that is alone returns no results
export class SearchForm extends Component {


  // FIXME: don't necessarily like this down at SearchForm
  // level just to get at router and add values to router
  // so they go into state
  static get contextTypes() {
    return({
        router: PropTypes.object
    })
  }

  constructor(props) {
    super(props)
    this.handleSubmitSearch = this.handleSubmitSearch.bind(this)
    // NOTE: could do like this too
    //this.handleSubmitSearch = () => this.handleSubmitSearch();
  }

  handleSubmitSearch(e) {
    e.preventDefault();

    const { dispatch } = this.props;
      
    const allWords = this.allWords
    const exactMatch = this.exactMatch
    const atLeastOne = this.atLeastOne
    const noMatch = this.noMatch

    const compoundSearch = {
       'allWords': allWords.value,
       'exactMatch': exactMatch.value,
       'atLeastOne': atLeastOne.value,
       'noMatch': noMatch.value
     }

    /*
     * FIXME: should only add these to route if there is a value
     *
     *
     * FIXME: this path should be global, configurable
     */
    this.context.router.push({
      pathname: '/scholars_search/',
      query: compoundSearch 
    })

    dispatch(actions.fetchSearch(compoundSearch, 0))
    //actions.fetchSearch(compoundSearch, 0)
 
  }

  render() {
     //const { query, isFetching } = this.props;

    return (

       <div>
        <form onSubmit={this.handleSubmitSearch}>
          <div className="form-group">
            <label>With all these words</label>
            <input type="text" ref={(ref) => this.allWords = ref} className="form-control"/>
          </div>
           <div className="form-group">
            <label>With the exact phrase</label>
            <input type="text" ref={(ref) => this.exactMatch = ref} className="form-control"/>
          </div>
           <div className="form-group">
            <label>With at least one of these words</label>
            <input type="text" ref={(ref) => this.atLeastOne = ref} className="form-control"/>
          </div>
           <div className="form-group">
            <label>With none of these words</label>
            <input type="text" ref={(ref) => this.noMatch = ref} className="form-control"/>
          </div>
          <button type="submit" className="btn btn-default">Submit</button>
        </form>

        <SearchResults />
 
      </div>

    )
  }

}

//export default SearchForm

// import react-redux helper to create a wrapped  Dashboard that
// can be connected to a store
import { connect } from 'react-redux'
// make a function that maps the stores state to the props
// of our top-level component, anything goes here, just return
// and object and use the state as you see fit.
// get greeting from query params now that we have routes
const mapStateToProps = (search, ownProps) => {
  return {
    search: search
    //displayMessage: state.displayMessage,
    //greeting: ownProps.location.query.greeting
  }
}

// wrap the dashboard componet with redux functions
// standared imports will get this 'connected' component
export default connect(mapStateToProps)(SearchForm);

