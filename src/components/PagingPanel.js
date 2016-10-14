import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { PAGE_ROWS } from '../actions/constants'

import classNames from 'classnames'

import { requestSearch } from '../actions/search'

import TabPicker from './TabPicker'

import ReactDOM from 'react-dom'

import SearchTabs from './SearchTabs'

import helper from '../utils/PagingHelper'


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

    let pageMap = helper.pageArrays(totalPages, currentPage)
    // pageMap is an array set of arrays
    // more/less links are returned as ['+', 16] or ['-'] (means no number)
    //
    // so example might be [['+', 1][16...30]['+', 31]]
 
    let [previous, current, next] = pageMap
    
    let flip = (x, direction) => {
      if(x[0] == '+') {
        let pageNumber = x[1]

        let desc = (<span><span aria-hidden="true">&laquo;</span> Previous</span>)
        if (direction == 'forward') {
          desc = (<span>Next <span aria-hidden="true">&raquo;</span></span>)
        }
        return (<li><a href="#" onClick={(e) => this.handlePage(e, pageNumber)}>{desc}</a></li>) 
      }
    }

    let pages = _.map(current, (x) => {
       let active = (x == currentPage) ? true : false
       return page(x, active)
    })

    let backward = flip(previous, 'backward') 
    let forward = flip(next, 'forward') 

    const paging = () => {
      
      return (
        <nav>
          <ul className="pagination">
            {backward}
            {pages}
            {forward}
          </ul>
        </nav>
      )
    }

    
    const pageList = paging()

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

