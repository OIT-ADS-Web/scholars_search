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
 
    this.handlePage = this.handlePage.bind(this) 
  }

  
  componentDidUpdate() {
    window.scrollTo(0, 0)
  }
 

  handlePage(e, pageNumber) {
    e.preventDefault()

    // given page - what is start ??
    const { search : { searchFields }, dispatch } = this.props

    // given page (in parameter) calculate start
    //
    let start = searchFields ? searchFields['start'] : 0
    //let newStart = Math.floor(start) + PAGE_ROWS
    let newStart = (pageNumber - 1) * PAGE_ROWS

    // NOTE: if not a new 'query' obj (like below) - this error happens:
    // useQueries.js:35 Uncaught TypeError: object.hasOwnProperty is not a function
    const query = { ...searchFields, start: newStart }

    let full_query = { ...query }

    let filter = searchFields['filter']
    let tabPicker =  new TabPicker(filter)

    let filterer = tabPicker.filterer

    dispatch(requestSearch(full_query, filterer))
 
    this.context.router.push({
      pathname: '/',
      query: full_query

    })
  
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

    let filter = searchFields['filter']
    let tabPicker =  new TabPicker(filter)

    let filterer = tabPicker.filterer

    dispatch(requestSearch(full_query, filterer))
 
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

    let filter = searchFields['filter']
    let tabPicker =  new TabPicker(filter)

    let filterer = tabPicker.filterer

    dispatch(requestSearch(full_query, filterer))

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
 
    const page = (pageNumber, active) => {
      if(active) {
        return (
         <li className="active">
           <span>{pageNumber}</span>
         </li>
        )
      } else {
         return (
          <li>
            <span>
              <a href="#" onClick={(e) => this.handlePage(e, pageNumber)}>{pageNumber}</a>
            </span>
          </li>
        )
      }
    }

    // needs to be a limit of 10 ? or something else?
    // http://ux.stackexchange.com/questions/4127/design-suggestion-for-pagination-with-a-large-number-of-pages
    //
    // I prefer to use smart truncation to display the most helpful page links. In other words, 
    // I show the first 3, ..., the current page with a padding of 3 (3 on either side), 
    // another ..., then the last 3. With a lot of pages, the links above the list look 
    // like this (the mouse is hovering over 56):

    // first 3
    // -3 [current] + 3
    // last 3
    //
    // if page > 12 ---
    // 1,2,3  ... 4,5,6,7,8,9 ... 10,11,12
    //
    
    /*
    const pages = _.map(_.range(1, totalPages+1), function(x) {
      let active = (x == currentPage) ? true : false 
      return page(x, active)
    })
    */

    const pages = (
       <li>
         <span>Page {currentPage} of {totalPages}</span>
       </li>
    )

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
             
            {pages}
             
            <li className={nextClasses}>
              <a href="#" aria-label="Next" onClick={this.handleNextPage} className={nextClasses}>
                  <span aria-hidden="true">&raquo;</span>
               </a>
            </li>

          </ul>
        </nav>
      )
    }

    
    /*
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
    */

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

    const pageList = paging(next, previous)

    //return (
    //    pages
   // )
    
    return (
      pageList
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

