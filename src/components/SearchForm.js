import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'

import actions from '../actions/search'

import SearchResults from './SearchResults'
import SearchField from './SearchField'

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
    
    const { search : { start, filter }, dispatch } = this.props;
 
    const allWords = this.allWords
    const exactMatch = this.exactMatch
    const atLeastOne = this.atLeastOne
    const noMatch = this.noMatch

    var add = "";
    if (allWords.value.lastIndexOf('*', 0) != 0) {
     add = "*"
    }
    // NOTE: allWords search is more complicated,
    // needs a '*' possibly after every word, but then again
    // that's making assumptions
    //
    // would need to add to term + update UI
    // could also just add as event handler
    // to allWords ...
    // default filter to 'person' ?
    //
    //
    // NOTE: having problems with 'start' - setting
    // it to 0 here
    //
    // not sure what to do with filter
    const compoundSearch = {
       'allWords': allWords.value,
       'exactMatch': exactMatch.value,
       'atLeastOne': atLeastOne.value,
       'noMatch': noMatch.value,
       'start': 0,
       'filter': filter
     }

    /*
     * FIXME: should only add these to route if there is a value
     *
     *
     * FIXME: this path should be global, configurable
     */
    this.context.router.push({
      pathname: '/',
      query: compoundSearch 
    })

    //dispatch(actions.resetFilter())

    dispatch(actions.fetchTabCounts(compoundSearch))
    dispatch(actions.fetchSearch(compoundSearch, 0, filter))

    // NOTE: was having problems with reseting page - so 
    // defaulted to setting start to 0 in function
    // calls - but I was getting [ page 2 of 0] if I didn't do this
    //
    dispatch(actions.resetPage())
    dispatch(actions.filterSearch(filter))
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

