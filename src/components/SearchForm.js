import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'

import actions from '../actions/search'

import SearchResults from './SearchResults'
import SearchField from './SearchField'

import * as types from '../actions/types'

import { requestSearch, requestTabCount, requestFilter } from '../actions/search'

export class SearchForm extends Component {


  static get contextTypes() {
    return({
        router: PropTypes.object
    })
  }

  constructor(props, context) {
    super(props, context)
    this.handleSubmitSearch = this.handleSubmitSearch.bind(this)
  }

  handleSubmitSearch(e) {
    e.preventDefault();
    //const { search : { start, filter }, dispatch } = this.props;
    const { search : { searchFields }, dispatch } = this.props;
 
    const allWords = this.allWords
    const exactMatch = this.exactMatch
    const atLeastOne = this.atLeastOne
    const noMatch = this.noMatch

    var add = "";
    if (allWords.value.lastIndexOf('*', 0) != 0) {
     add = "*"
    }
    // NOTE: allWords search needs a '*' after every word, otherwise it's searching
    // exactly.  Then again, maybe the user wants the ability to differentiate the two.
    
    // NOTE: if someone is searching 'organizations' tab - go ahead and persist
    // that tab - but default to 'person' tab if nothing is there
    let filter = searchFields ? (searchFields['filter'] || 'person') : 'person'

    // NOTE: if it's a new search - just default to page 0 instead of something weird
    let start = 0
    const compoundSearch = {
       'allWords': allWords.value,
       'exactMatch': exactMatch.value,
       'atLeastOne': atLeastOne.value,
       'noMatch': noMatch.value,
       'start': start,
       'filter': filter
     }

    /*
     * FIXME: should only add these to route if there is a value
     * e.g. it really shouldn't search a 'blank' search
     *
     * FIXME: this pathname should be global, configurable, right?
     */
    this.context.router.push({
      pathname: '/',
      query: compoundSearch 
    })


    dispatch(requestSearch(compoundSearch))
    dispatch(requestTabCount(compoundSearch))

    // thunk version
    //dispatch(actions.fetchTabCounts(compoundSearch))
    //dispatch(actions.fetchSearch(compoundSearch, 0, filter))
    //dispatch(actions.resetPage())

    // even though fetchSearch(...filter) takes filter this was needed
    //dispatch(actions.filterSearch(filter))
    
    // on the other hand, this does NOT seem necessary.  Why not?
    //dispatch(actions.resetFilter())

  }

  render() {
    const { search : { isFetching, searchFields } } = this.props;

    let query = { ...searchFields }

    const allWords = query.allWords
    const exactMatch = query.exactMatch
    const atLeastOne = query.atLeastOne
    const noMatch = query.noMatch

    // FIXME: probably better way to do this
    let button
    if (isFetching) {
         button = <button type="submit" className="btn btn-primary" disabled>Submit</button>
    } else {
         button = <button type="submit" className="btn btn-primary">Submit</button>
    }

    // NOTE: it took a while to figure out how to set the defaultValue of the <inputs> below (SearchField) - the typical React lifecycle of components
    // will just allow setting that value once (which was always initializing to NULL).  I'm pretty sure the code is initializing the form too
    // many times or too soon or something like that.  I was not able to track that down though.  This works for now.
    return (
       
       <section>

        <form onSubmit={this.handleSubmitSearch}>
          
          <SearchField label="With all these words" ref={(ref) => this.allWords = ref} defaultValue={allWords} placeholder="Multiple, Terms, Use, Comma" />
          <SearchField label="With the exact phrase" ref={(ref) => this.exactMatch = ref} defaultValue={exactMatch} placeholder="Exact Match" />
          <SearchField label="With at least one of these words" ref={(ref) => this.atLeastOne = ref} defaultValue={atLeastOne} placeholder="Multiple, Terms, Use, Comma" />
          <SearchField label="With none these words" ref={(ref) => this.noMatch = ref} defaultValue={noMatch} placeholder="Multiple, Terms, Use, Comma" />
 
          {button}

        </form>
       
           
        <hr/>
 
      </section>

    )
  }

}

import { connect } from 'react-redux'

const mapStateToProps = (search, ownProps) => {
  return search
}

export default connect(mapStateToProps)(SearchForm);

