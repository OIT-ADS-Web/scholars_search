import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { PAGE_ROWS } from '../actions/constants'

import classNames from 'classnames'

import { requestSearch } from '../actions/search'

import TabPicker from './TabPicker'

import ReactDOM from 'react-dom'

import SearchTabs from './SearchTabs'

export class PagingPanel extends Component {

  // FIXME: don't necessarily like this down at PagingPanel component
  // level just to get at router and add values to router so they go into state
  static get contextTypes() {
    return({
      router: PropTypes.object.isRequired
    })
  }

  constructor(props, context) {
    super(props, context)
    
    this.handleNextPage = this.handleNextPage.bind(this)
    this.handlePreviousPage = this.handlePreviousPage.bind(this)
 
    this.facets = this.props.facets
  
  }

  
  componentDidUpdate() {
    //ReactDOM.findDOMNode(this).scrollTop = 0
    // do this, or not?
    window.scrollTo(0, 0)

  }
 

  handleNextPage(e) {
    e.preventDefault()

    if (e.currentTarget.className == 'disabled') {
      return false
    }  

    const { search : { searchFields }, dispatch } = this.props

    let start = searchFields ? searchFields['start'] : 0
    let newStart = Math.floor(start) + PAGE_ROWS

    // NOTE: if not a new 'query' obj (like below) - this error happens:
    // useQueries.js:35 Uncaught TypeError: object.hasOwnProperty is not a function
    const query = { ...searchFields, start: newStart }

    let full_query = { ...query }

    // FIXME: I assume filter would be in the searchFields by now
    // could add this to be safe:
    //let filter = searchFields ? (searchFields['filter'] || 'person') : 'person'

    // FIXME: how to persist facet filters ???
    //
    let filter = searchFields['filter']
    let tabPicker =  new TabPicker(filter)

    // FIXME: this is sent in as from chosen_facets of search_results
    // means we have to kind of keep tracking of reproducing the search
    //
    let chosen_ids = this.facets
 
    let tab = tabPicker.tab

    if (chosen_ids) {
      tab.setActiveFacets(chosen_ids)
      full_query['facetIds'] = this.chosen_ids
   
    }
    // FIXME: would like this to force going back up to top of page
    //
    dispatch(requestSearch(full_query, tab))
 
    full_query['facetIds'] = this.facets

    this.context.router.push({
      pathname: '/',
      query: full_query

    })
      
  }

  handlePreviousPage(e) {
    e.preventDefault()

    if (e.currentTarget.className == 'disabled') {
      return false
    }  
    
    const { search : { searchFields }, dispatch } = this.props

    let start = searchFields ? searchFields['start'] : 0
    let newStart = Math.floor(start) - PAGE_ROWS
    
    const query = { ...searchFields, start: newStart }

    let full_query = { ...query }

    // FIXME: I assume filter would be in the searchFields by now
    // could add this to be safe:
    //let filter = searchFields ? (searchFields['filter'] || 'person') : 'person'

    let filter = searchFields['filter']
    let tabPicker =  new TabPicker(filter)

    let chosen_ids = this.facets

    let tab = tabPicker.tab

    if (chosen_ids) {
      tab.setActiveFacets(chosen_ids)
      full_query['facetIds'] = this.chosen_ids
    }

    dispatch(requestSearch(full_query, tab))

    this.context.router.push({
      pathname: '/',
      query: full_query

    })
 
  }

  render() {
    // so start should be coming from search object (state)
    const { search : { results, searchFields } } = this.props

    let { response={} } = results
    let { numFound=0,docs } = response

    let start = searchFields['start'] || 0

    if (!docs) {
      return ( <div></div> )
    }

     // FIXME: need to update this the [<<][<][1][2]...[>][>>] kind of thing
    
    // 105 results
    // start at 50
    // would be page 2 of 3
    // NOTE: all these Math.floor(s) are annoying
    //
    let totalPages = Math.floor(numFound/PAGE_ROWS)
    const remainder = numFound % PAGE_ROWS
    if (remainder) {
      totalPages +=1
    }

    if (totalPages == 0) {
      return ( <div></div> )
    }

    const currentPage = Math.floor(start/PAGE_ROWS) + 1
   
    const paging = (next, prev) => {
      const nextClasses = classNames({disabled: !next})     
      const prevClasses = classNames({disabled: !prev})     
      
      return (
        <nav>
          <ul className="pagination">
            <li className={prevClasses}>
              <a href="#" aria-label="Previous" onClick={this.handlePreviousPage} className={prevClasses}>
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            
            <li>
              <span>Page {currentPage} of {totalPages}</span>
            </li>

            <li className={nextClasses}>
              <a href="#" aria-label="Next" onClick={this.handleNextPage} className={nextClasses}>
                  <span aria-hidden="true">&raquo;</span>
               </a>
            </li>

          </ul>
        </nav>
      )
    }

    let next = false
    let previous = false

    // (50 + 50 < 105)

    if ((Math.floor(start) + Math.floor(PAGE_ROWS)) < numFound) {
      next = true
    }
    // (100 > 50 and some found)
    if (Math.floor(start) >= Math.floor(PAGE_ROWS)) {
      previous = true
    }

    if (numFound == 0) {
      next = false
      previous = false
    }

    const page = paging(next, previous)

    return (
      page
    )

  }

}

// FIXME: this is just returning the same state
// seems like no point in that, but otherwise says
// no property 'results' etc...
const mapStateToProps = (search, ownProps) => {
  return  search;
}

export default connect(mapStateToProps)(PagingPanel);

