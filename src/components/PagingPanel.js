import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { PAGE_ROWS } from '../actions/search'

import classNames from 'classnames'

import actions from '../actions/search'

// NOTE: props are sent to components
class PagingPanel extends Component {


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
    
    this.handleNextPage = this.handleNextPage.bind(this)
    this.handlePreviousPage = this.handlePreviousPage.bind(this)
  }


  handleNextPage(e) {
    // FIXME: right now this is NOT taking into account tabs
    //
    e.preventDefault()

    if (e.currentTarget.className == 'disabled') {
       return false
    }  
     
    const { search : { searchFields, start, filter }, dispatch } = this.props
    
    dispatch(actions.nextPage())
    
    // FIXME: seems like actions.nextPage should do the start + PAGE_ROWS stuff
    //

    let newStart = start + PAGE_ROWS

    searchFields['start'] =  newStart

    this.context.router.push({
      pathname: '/',
      query: searchFields

    })

    dispatch(actions.fetchSearch(searchFields, newStart, filter))
  }

  handlePreviousPage(e) {
    e.preventDefault()

    if (e.currentTarget.className == 'disabled') {
       return false
    }  
    
    const { search : { searchFields, start, filter }, dispatch } = this.props

    dispatch(actions.previousPage())

    let newStart = start - PAGE_ROWS 
    // FIXME: seems like actions.previousPage() would take care of this    
    searchFields['start'] = newStart

    this.context.router.push({
      pathname: '/',
      query: searchFields

    })


    // FIXME: seems like I shouldn't have to do start - PAGE_ROWS,
    // but otherwise it uses the the start from const { search : { start ...
    // which is still what it was when the method was called (not updated)
    //
    dispatch(actions.fetchSearch(searchFields, newStart, filter))
  }

  render() {
    //const { search : {filter} } = this.props

    //
    // so start should be coming from search object (state)
    const { search : { results, searchFields, start=0, filter, isFetching } } = this.props

    let { highlighting={}, response={} } = results
    let { numFound=0,docs } = response
    
    if (!docs) {
      return ( <div></div> )
    }

     // FIXME: need to update this the [<<][<][1][2]...[>][>>] kind of thing
    
    // 105 results
    // start at 50
    // would be page 2 of 3
    //   
    var totalPages = Math.floor(numFound/PAGE_ROWS)
    const remainder = numFound % PAGE_ROWS
    if (remainder) {
      totalPages +=1
    }

    //const totalPages = numFound / PAGE_ROWS 
    console.log(`pages=${totalPages}`)
    const currentPage = Math.floor(start/PAGE_ROWS) + 1
   
    console.log(`currentPage=${currentPage}`) 

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

    var next = false
    var previous = false

    // (50 + 50 < 105)
    if ((start + PAGE_ROWS) < numFound) {
      next = true
    }
    // (100 > 50 and some found)
    if (start >= PAGE_ROWS) {
      previous = true
    }

    if (numFound == 0) {
      next = false
      previous = false
    }

    console.log(`next=${next}, prev=${previous}`)

    const page = paging(next, previous)

    return (
        page
    )

  }

}

/*
export default ({page=1, page_size=5, count, onNextPage, onPreviousPage, ...props}) => {
    const total_pages = Math.ceil(count / page_size);

    return <div className="row">
        {page==1?null:<button onClick={e => {
            e.preventDefault();
            onPreviousPage();
        }}>&lt;</button>}
        &nbsp; Page {page} of {total_pages} &nbsp;
        {page==total_pages?null:<button onClick={e => {
            e.preventDefault();
            onNextPage();
        }}>&gt;</button>}
    </div>
}
*/

//export default PagingPanel


// NOTE: I think I need to connect to make this communicate - but it seems 
// like it should be a subcomponent of SearchResults
// maybe this.parent->
//
//

// FIXME: this is just returning the same state
// seems like no point in that, but otherwise says
// no property 'results' etc...
const mapStateToProps = (search) => {
  return  search;
}

// NOTE: doesn't seem to ever call unless I connect ...
//export default SearchResults

export default connect(mapStateToProps)(PagingPanel);


/*
 *
 * export default ({page=1, page_size=5, count, onNextPage, onPreviousPage, ...props}) => (
    total_pages => <div className="row">
        {page==1?null:<button onClick={e => {  }}>&lt;</button>}
        &nbsp; Page {page} of {total_pages} &nbsp;
        {page==total_pages?null:<button onClick={e => {  }}>&gt;</button>}
    </div>
)(Math.ceil(count / page_size))
  */

