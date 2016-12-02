import React, { Component, PropTypes } from 'react'

import SearchField from './SearchField'
import SearchFieldHidden from './SearchFieldHidden'

import classNames from 'classnames'

import { requestSearch, requestTabCount, emptySearch } from '../actions/search'

import solr from '../utils/SolrHelpers'

import TabPicker from './TabPicker'
import { tabList } from './TabPicker'

import querystring from 'querystring'

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
  
    this.path = "/"
  }

  handleAdvancedSearch(e) {
    e.preventDefault()

    // NOTE: seems wrong to do this, maybe it's fine
    this.advanced.value = "true"
     
    this.handleSubmitSearch(e)
  }

  handleSubmitSearch(e) {
    e.preventDefault()
    
    const { search : { searchFields }, dispatch } = this.props
 
    const allWords = this.allWords
    const exactMatch = this.exactMatch
    const atLeastOne = this.atLeastOne
    const noMatch = this.noMatch
    const advanced = this.advanced

    // NOTE: per Julia's request - just default to people tab on any new search
    let filter = 'person'
    //
    // NOTE: if it's a new search - default to page 0 so we're not trying 
    // to get a non-existent page of data
    let start = 0
   
    const compoundSearch = {
      'exactMatch': exactMatch.value,
      'allWords': allWords.value,
      'atLeastOne': atLeastOne.value,
      'noMatch': noMatch.value,
      'start': start,
      'filter': filter,
      'advanced': advanced.value
    }

    this.context.router.push({
      pathname: this.path,
      query: compoundSearch 
    })

    let tabPicker = new TabPicker(filter)
 
    let filterer = tabPicker.filterer

    if (solr.isEmptySearch(compoundSearch)) {
      dispatch(emptySearch())
    } 
    else {

      let base_query = solr.buildComplexQuery(compoundSearch)
      
      let full_query = { ...compoundSearch }

      // empty out the facets when we do a new search
      full_query['facetIds'] = []
 
      dispatch(requestSearch(full_query, filterer))

      dispatch(requestTabCount(compoundSearch, tabList))
    }

    allWords.focus()
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
      button = <button type="submit" className="btn btn-primary btn-sm" disabled>Search</button>
    } else {
      button = <button type="submit" className="btn btn-primary btn-sm">Search</button>
    }

    // NOTE: since we're not getting searchFields from parameters, but we
    // still need to catch ?advanced=true (to open up advanced form) this is necessary
    // don't like depending on locationBeforeTransitions though, since it's undocumented 
    // and internal to the router and could change without notice
    const { routing: { locationBeforeTransitions } } = this.props
    
    const advanced = query.advanced ? query.advanced : (locationBeforeTransitions.query.advanced || false)

    // FIXME: this seems too double-negative-y to me, maybe there's a clearer way to name
    //
    // hide advanced = not (advanced)
    // hidden = not (advanced)
    // show = not (not (advanced))
    //
    let hideAdvanced = !(advanced === 'true')
 
    const advancedClasses = classNames({advanced: true, hidden: hideAdvanced})     
    // NOTE: just the oppposite
    const showHideClasses = classNames({hidden: !hideAdvanced})

    //
    // NOTE: it took a while to figure out how to set the defaultValue of the <inputs> below (SearchField) - the typical React lifecycle of components
    // will just allow setting that value once (which was always initializing to NULL).  I'm pretty sure the code is initializing the form too
    // many times or too soon or something like that.  I was not able to track that down though.  This works for now.
    return (
       
       <section className="search-form well">

        <form onSubmit={this.handleSubmitSearch} className="form-horizontal">

        <div className="row">        
          
          <div className="col-md-8">
            <SearchField label="With all of these words" ref={(ref) => this.allWords = ref} defaultValue={allWords} placeholder="Multiple, Terms, Use, Comma" autofocus={true}/>
        
            <div className={advancedClasses}>
              <SearchField label="With the exact phrase" ref={(ref) => this.exactMatch = ref} defaultValue={exactMatch} placeholder="Exact Match"  />
              <SearchField label="With any of these words" ref={(ref) => this.atLeastOne = ref} defaultValue={atLeastOne} placeholder="Multiple, Terms, Use, Comma" />
              <SearchField label="With none of these words" ref={(ref) => this.noMatch = ref} defaultValue={noMatch} placeholder="Multiple, Terms, Use, Comma" />
            </div>

            <SearchFieldHidden ref={(ref) => this.advanced = ref} defaultValue={advanced} />
          </div>

          <div className="col-md-4">
            <div className={showHideClasses}><a href="#" className="btn btn-success pull-right btn-sm" onClick={this.handleAdvancedSearch}>Advanced Search...</a></div>
            {button}
          </div>
        </div>

        </form>
       
           
 
      </section>

    )
  }

}

import { connect } from 'react-redux'

const mapStateToProps = (search, ownProps) => {
  return search
}

export default connect(mapStateToProps)(SearchForm);

