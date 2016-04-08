import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { PAGE_ROWS } from '../actions/search'
//import { nextPage, fetchSearch } from '../actions/search'

import PersonDisplay from './PersonDisplay'

import actions from '../actions/search'

class SearchResults extends Component {

  constructor(props) {
    super(props);
    this.handleNextPage = this.handleNextPage.bind(this);
  }

  handleNextPage(e) {
    e.preventDefault();
    
    //const { dispatch, search: { searchFields, start } } = this.props;
    const { search, dispatch } = this.props;
    //const { dispatch } = this.props;
 
    // FIXME: need to recreate compoundSearch here ... from URL params?
    //
    console.log("SearchResults#handleNextPage")
    console.log(`SEARCH=${search}`)
    console.log(search)

    console.log("Does dispatch() exist here?")
    console.log(dispatch)

    //console.log(`start=${start}`)
    //console.log(dispatch)
    dispatch(actions.nextPage());
    console.log("after dispatch")
 
    dispatch(actions.fetchSearch(search.searchFields, search.start));
  }
  
  render() {

    const { search : { results, searchFields } } = this.props;
    console.log("SearchResults.render()")
    console.log(this.props)

    //let { numFound=0,docs,start=0, highlighting={} } = results;
    let { highlighting={}, response={} } = results;
    let { numFound=0,docs,start=0 } = response;

    console.log("SearchResults#render()highlighting***")
    console.log(highlighting)

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

          console.log(display)
          return <PersonDisplay key={doc.path} doc={doc} display={display}/> 
      });
      // sidebar = ... <FacetSidebar />  --- likely will become big component
    }
    else {
      console.log("SearchResults.render() - NO DOCS")
    }

    let page = "";
    if ( (start + PAGE_ROWS ) < numFound ) {
      page = (
          <button onClick={this.handleNextPage}>Next</button>
      );
    }
    // NOTE: searchFields is undefined
   console.log("SearchResults#renders")
   console.log(searchFields)

   // FIXME: should expand this to illustrate advanced search
   const query = searchFields ? searchFields.allWords : ''

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
