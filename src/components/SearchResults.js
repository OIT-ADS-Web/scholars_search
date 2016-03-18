import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { PAGE_ROWS } from '../actions/search'
import { nextPage, fetchSearch } from '../actions/search'

import PersonDisplay from './PersonDisplay'


class SearchResults extends Component {

  constructor(props) {
    super(props);
    this.handleNextPage = this.handleNextPage.bind(this);
  }

  handleNextPage(e) {
    e.preventDefault();
    const { dispatch, search: { query, start } } = this.props;
    //dispatch(nextPage());
    //console.log(`....----> query: ${query} / ${start}`);
    //dispatch(fetchSearch(query, start));
  }
  
  render() {
    const { search : { results } } = this.props;
    let { numFound=0,docs,start=0 } = results;
    
    let r = "";
    // NOTE: this will change depending on type
    if (docs) {
      r = docs.map(doc => <PersonDisplay key={doc.path} doc={doc} /> );
    }
    let page = "";
    if ( (start + PAGE_ROWS ) < numFound ) {
      page = (
          <button onClick={this.handleNextPage}>Next</button>
      );
    }
    return (
      <div>
        <h3>Results found: {numFound} </h3>
        <div>
          {r}
          {page}
        </div>
      </div>

    );
  }
  
}



//const mapStateToProps = (state) => {
//  const { search } = state;
//  return { search };
//};

//export default connect(mapStateToProps)(SearchResults);

// export default connect()(SearchResults);
