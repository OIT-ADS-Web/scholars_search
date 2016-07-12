import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

//import { PAGE_ROWS } from '../actions/search'
import { PAGE_ROWS } from '../actions/constants'

import classNames from 'classnames'

import { requestSearch } from '../actions/search'

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
  }

  handleNextPage(e) {
    e.preventDefault()

    if (e.currentTarget.className == 'disabled') {
      return false
    }  

    const { search : { searchFields }, dispatch } = this.props

    let start = searchFields ? searchFields['start'] : 0
    let newStart = Math.floor(start) + PAGE_ROWS

    // NOTE: if not a new 'query' obj - this error happens:
    // useQueries.js:35 Uncaught TypeError: object.hasOwnProperty is not a function
    const query = { ...searchFields, start: newStart }

    this.context.router.push({
      pathname: '/',
      query: query

    })
      
    dispatch(requestSearch(query))
    
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

    this.context.router.push({
      pathname: '/',
      query: query

    })
 
    dispatch(requestSearch(query))
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

