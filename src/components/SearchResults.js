import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { PAGE_ROWS } from '../actions/search'
//import { nextPage, fetchSearch } from '../actions/search'

import PersonDisplay from './PersonDisplay'

import actions from '../actions/search'

import solr from '../utils/SolrQuery'
import classNames from 'classnames'

class SearchResults extends Component {

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

    // before here?
    //if (start + PAGE_ROWS > (numFound - PAGE_ROWS)) {
    //  return
    //}

    dispatch(actions.nextPage());
    
    // FIXME: where to skip when it's reached the max    
    //const { search : { results, searchFields, start }, dispatch } = this.props;
    
    //let { response={} } = results;
    //let { numFound=0 } = response;


    // FIXME: doesn't seem to reset when we do a new search
    // 50 goes up to 100
    //const start = search.start
    //
    // ? get the new start value?
    //
    //const newStart = { search: { start } } = this.props
    //
    //

    console.log(`handleNextPage->start(after nextPage())=${start}`)
   
    // start + PAGE_ROWS
    dispatch(actions.fetchSearch(searchFields, start + PAGE_ROWS));
  }

  handlePreviousPage(e) {
    e.preventDefault();
    
    //const { search, dispatch } = this.props;
    const { search : { results, searchFields, start }, dispatch } = this.props;

    console.log(`handlePreviousPage->start=${start}`)

    let { response={} } = results;
    //let { numFound=0 } = response;


    //if ((start - PAGE_ROWS) < PAGE_ROWS) {
    //  return
    //}

    dispatch(actions.previousPage());
 
    // FIXME: doesn't seem to reset when we do a new search
    // 50 goes up to 100
    //
    // FIXME: add 'start' to route?
    // is the action updating the state yet?  
    //const start = search.start
    // 
    console.log(`handlePreviousPage->start(after previousPage())=${start}`)

    // FIXME: seems like I shouldn't have to do start - PAGE_ROWS,
    // but otherwise it uses the the start from const { search : { start ...
    // which is still what it was when the method was called (not updated)
    //
    dispatch(actions.fetchSearch(searchFields, start - PAGE_ROWS));
  }
   
  render() {

    // so start should be coming from search object (state)
    const { search : { results, searchFields, start=0 } } = this.props;

    let { highlighting={}, response={} } = results;
    let { numFound=0,docs } = response;


    let resultSet = "";

    // NOTE: this will change depending on type e.g.
    // <PublicationDisplay ..
    // <PersonDisplay ..
    // etc...
    //
    //
    // FIXME: during iteration - for now - gather classification groups?
    // then later send that as a filter for the search ??
    //
    if (docs) {


      resultSet = docs.map(doc => { 
          let highlight = highlighting[doc.DocId]
          var display = ""
          if (highlight) {
             display = highlight.ALLTEXT ? highlight.ALLTEXT[0] : doc.type[0]
          } else {
             display = doc.ALLTEXT[0]
          }

          return <PersonDisplay key={doc.path} doc={doc} display={display}/> 
      });
      // sidebar = ... <FacetSidebar />  --- likely will become big component
    }
    else {
      //
      console.log("SearchResults.render() - NO DOCS")
    }

    console.log("SearchResults.render() - start="+start)

    const paging = (next, prev) => {
      const nextClasses = classNames({disabled: !next})     
      const prevClasses = classNames({disabled: !prev})     
      
      return (
        <div>
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

    // FIXME: should expand this to illustrate advanced search
    // e.g. (? AND ?) AND (? OR ?) and NOT .. etc...
    //
    //const query = searchFields ? searchFields.allWords : ''
    let query = solr.buildComplexQuery(searchFields)


    // sidebar of classifications - with counts
    //
    //classgroup": [
    //  "http://vivoweb.org/ontology#vitroClassGroupactivities",
    //  "http://vivoweb.org/ontology#vitroClassGroupactivities"

    /*
     *           <PagingPanel count={count} page={page} onNextPage={() => {
            changePage(page+1);
            loadBooks()
        }} onPreviousPage={ () => {
            changePage(page-1);
            loadBooks()
        }} />
    */
    return (
      <section className="search-results">
        <h2>Query: {query}</h2>
        <h3>Results found: {numFound} </h3>
        <ul>
          {resultSet}
        </ul>
        <div>{page}</div>

      </section>

    );
  }
  
}

// FIXME: this is just returning the same state
// seems like no point in that, but otherwise says
// no property 'results' etc...
const mapStateToProps = (search) => {
  return  search;
};

// NOTE: doesn't seem to ever call unless I connect ...
//export default SearchResults

export default connect(mapStateToProps)(SearchResults);

// this doesn't seem to pass along state either
//export default connect()(SearchResults);
