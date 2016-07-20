import React, { Component, PropTypes } from 'react'

import SearchField from './SearchField'
import SearchFieldHidden from './SearchFieldHidden'

import classNames from 'classnames'

import { requestSearch, requestTabCount, emptySearch } from '../actions/search'

import solr from '../utils/SolrHelpers'

//var ReactDOM = require('react-dom');
import ReactDOM from 'react-dom'

export class SearchForm extends Component {


  static get contextTypes() {
    return({
      router: PropTypes.object
    })
  }

  constructor(props, context) {
    super(props, context)
    this.handleSubmitSearch = this.handleSubmitSearch.bind(this)
    this.handleAdvancedSearch = this.handleAdvancedSearch.bind(this)
  }

  handleAdvancedSearch(e) {
    e.preventDefault()

    // NOTE: seems wrong to do this, maybe it's fine
    this.advanced.value = "true"
    
    // FIXME: still have problem of searching *:* (everything)
     
    this.handleSubmitSearch(e)
    /// need to add to query parameters ---
    // FIXME: need to autofocus on 'exactmatch' field, not sure how
    //
  }

  handleSubmitSearch(e) {
    e.preventDefault()
    
    const { search : { searchFields }, dispatch } = this.props
 
    const allWords = this.allWords
    const exactMatch = this.exactMatch
    const atLeastOne = this.atLeastOne
    const noMatch = this.noMatch
    const advanced = this.advanced

    // FIXME: should '*' wildcard be added to allWords word(s) or not?
    //let add = "";
    //if (allWords.value.lastIndexOf('*', 0) != 0) {
    //  add = "*"
    //}
    // NOTE: allWords search needs a '*' after every word, otherwise it's searching
    // exactly.  Then again, maybe the user wants the ability to differentiate the two.
    
    // NOTE: if someone is searching 'organizations' tab - go ahead and persist
    // that tab - but default to 'person' tab if nothing is there
    let filter = searchFields ? (searchFields['filter'] || 'person') : 'person'

    // NOTE: if it's a new search - just default to page 0 instead of something weird
    let start = 0
    
    // FIXME: need to NOT add &params if undefined
    const compoundSearch = {
      'exactMatch': exactMatch.value,
      'allWords': allWords.value,
      'atLeastOne': atLeastOne.value,
      'noMatch': noMatch.value,
      'start': start,
      'filter': filter,
      'advanced': advanced.value
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


    if (solr.isEmptySearch(compoundSearch)) {
      dispatch(emptySearch())
    } 
    else {
      dispatch(requestSearch(compoundSearch))
      dispatch(requestTabCount(compoundSearch))
    }

    exactMatch.focus()
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
      button = <button type="submit" className="btn btn-primary" disabled>Search</button>
    } else {
      button = <button type="submit" className="btn btn-primary">Search</button>
    }

    // NOTE: since we're not getting searchFields from parameters, but we
    // still need to catch ?advanced=true (to open up advanced form) this is necessary
    const { routing: { locationBeforeTransitions } } = this.props
    
    const advanced = query.advanced ? query.advanced : (locationBeforeTransitions.query.advanced || false)

    // FIXME: seems too double-negative-y 
    //const advanced = query.advanced
    let hideAdvanced = !(advanced === 'true')
 
    const advancedClasses = classNames({advanced: true, hidden: hideAdvanced})     
    // NOTE: just the oppposite
    const showHideClasses = classNames({hidden: !hideAdvanced})

    //
    // NOTE: it took a while to figure out how to set the defaultValue of the <inputs> below (SearchField) - the typical React lifecycle of components
    // will just allow setting that value once (which was always initializing to NULL).  I'm pretty sure the code is initializing the form too
    // many times or too soon or something like that.  I was not able to track that down though.  This works for now.
    return (
       
       <section>

        <form onSubmit={this.handleSubmitSearch} className="form-horizontal">
          
          <SearchField label="With the exact phrase" ref={(ref) => this.exactMatch = ref} defaultValue={exactMatch} placeholder="Exact Match" autofocus={true} />
          <div className={advancedClasses}>
            <SearchField label="With all of these words" ref={(ref) => this.allWords = ref} defaultValue={allWords} placeholder="Multiple, Terms, Use, Comma" />
            <SearchField label="With any of these words" ref={(ref) => this.atLeastOne = ref} defaultValue={atLeastOne} placeholder="Multiple, Terms, Use, Comma" />
            <SearchField label="With none of these words" ref={(ref) => this.noMatch = ref} defaultValue={noMatch} placeholder="Multiple, Terms, Use, Comma" />
          </div>

          <div className={showHideClasses}><a href="#" className="btn btn-success pull-right" onClick={this.handleAdvancedSearch}>Advanced Search...</a></div>

          <SearchFieldHidden ref={(ref) => this.advanced = ref} defaultValue={advanced} />
          
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
  //return { ...search,
  //  searchFields: ownProps.location.query,
  //}
    
}

export default connect(mapStateToProps)(SearchForm);

