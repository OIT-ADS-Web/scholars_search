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
    super(props);
    
    this.handleNextPage = this.handleNextPage.bind(this);
    this.handlePreviousPage = this.handlePreviousPage.bind(this);
  }


  handleNextPage(e) {
    e.preventDefault();

    // FIXME: where to skip when it's reached the max    
    const { search : { results, searchFields, start }, dispatch } = this.props;
    
    console.log(`handleNextPage->start=${start}`)

    let { response={} } = results;
    let { numFound=0 } = response;

    dispatch(actions.nextPage());
    
    searchFields['start'] = start + PAGE_ROWS

    this.context.router.push({
      pathname: '/',
      query: searchFields

    })


    console.log(`handleNextPage->start(after nextPage())=${start}`)
   
    dispatch(actions.fetchSearch(searchFields, start + PAGE_ROWS));
  }

  handlePreviousPage(e) {
    e.preventDefault();
    
    const { search : { results, searchFields, start }, dispatch } = this.props;

    console.log(`handlePreviousPage->start=${start}`)

    let { response={} } = results;

    dispatch(actions.previousPage());
 
    console.log(`handlePreviousPage->start(after previousPage())=${start}`)
    
    searchFields['start'] = start - PAGE_ROWS

    this.context.router.push({
      pathname: '/',
      query: searchFields

    })


    // FIXME: seems like I shouldn't have to do start - PAGE_ROWS,
    // but otherwise it uses the the start from const { search : { start ...
    // which is still what it was when the method was called (not updated)
    //
    dispatch(actions.fetchSearch(searchFields, start - PAGE_ROWS));
  }

  render() {
    //const { search : {filter} } = this.props

    // so start should be coming from search object (state)
    const { search : { results, searchFields, start=0, filter, isFetching } } = this.props;

    let { highlighting={}, response={} } = results;
    let { numFound=0,docs } = response;

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
        <div>
            <div>Pages={totalPages}; currentPage={currentPage}</div>
            <button onClick={this.handlePreviousPage} className={prevClasses}>Previous</button>
            <button onClick={this.handleNextPage} className={nextClasses}>Next</button>
        </div>
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

