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
    
    const { search, dispatch } = this.props;
 
    dispatch(actions.nextPage());
 
    // FIXME: doesn't seem to reset when we do a new search
    // 50 goes up to 100
    const start = search.start
    // 
    dispatch(actions.fetchSearch(search.searchFields, start));
  }

  handlePreviousPage(e) {
    e.preventDefault();
    
    const { search, dispatch } = this.props;
 
    dispatch(actions.previousPage());
 
    // FIXME: doesn't seem to reset when we do a new search
    // 50 goes up to 100
    //
    // FIXME: add 'start' to route?
    // is the action updating the state yet?  
    const start = search.start
    // 
    dispatch(actions.fetchSearch(search.searchFields, start));
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

    const paging = (prev, next) => {
      const nextClasses = classNames({disabled: 'true' ? next : 'false'})     
      const prevClasses = classNames({disabled: 'true'? prev : 'false'})     
      
      return (
        <div>
            <button onClick={this.handlePreviousPage} className={prevClasses}>Previous</button>
            <button onClick={this.handleNextPage} className={nextClasses}>Next</button>
        </div>
      )
    }

    var next = false
    var previous = false

    if ((start + PAGE_ROWS) < numFound) {
      next = true
    }
    if ((start >= PAGE_ROWS) && (numFound > 0)) {
      previous = true
    }

    const page = paging(next, previous)

    // FIXME: should expand this to illustrate advanced search
    // e.g. (? AND ?) AND (? OR ?) and NOT .. etc...
    //
    //const query = searchFields ? searchFields.allWords : ''
    let query = solr.buildComplexQuery(searchFields)

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
