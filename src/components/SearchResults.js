import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { Link } from 'react-router'

/* our stuff */
import { PAGE_ROWS } from '../actions/search'
import actions from '../actions/search'

import PersonDisplay from './PersonDisplay'
import PublicationDisplay from './PublicationDisplay'
import OrganizationDisplay from './OrganizationDisplay'
import GenericDisplay from './GenericDisplay'
import Loading from './Loading'
import SearchTabs from './SearchTabs'
import PagingPanel from './PagingPanel'



// FIXME: we don't want to do the actual SolrQuery here,
// so this should be something more like
// import solr from '../SolrConfig' e.g. site specific
// utils and such
import solr from '../utils/SolrQuery'

class SearchResults extends Component {

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
    
    //this.handlePersonTab = this.handlePersonTab.bind(this);
    //this.handlePublicationsTab = this.handlePublicationsTab.bind(this);
    //this.handleOrganizationsTab = this.handleOrganizationsTab.bind(this);


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

    // so start should be coming from search object (state)
    const { search : { results, searchFields, start=0, filter, isFetching } } = this.props;

    let { highlighting={}, response={} } = results;
    let { numFound=0,docs } = response;

    let resultSet = "";

    // FIXME: make it so results don't require inside knowledge of SOLR
    //
    //
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

      // if filter == 'people' <PersonDisplay ..
      // if filter == 'publication' <PublicationDisplay ..
      // etc...
      resultSet = docs.map(doc => { 
          let highlight = highlighting[doc.DocId]
          
          // seems like this needs to be pulled out as a callback-ish thing
          var display = ""
          if (highlight) {
             display = highlight.ALLTEXT ? highlight.ALLTEXT[0] : doc.type[0]
          } else {
             display = doc.ALLTEXT[0]
          }
          
          switch(filter) {
            case 'people':
              return <PersonDisplay key={doc.path} doc={doc} display={display}/> 
              break
            case 'publications':
              return <PublicationDisplay key={doc.path} doc={doc} display={display}/> 
              break
            case 'organizations':  
              return <OrganizationDisplay key={doc.path} doc={doc} display={display}/> 
              break
            default:  
              return <GenericDisplay key={doc.path} doc={doc} display={display}/> 
          }
      });
      // sidebar = ... <FacetSidebar />  --- likely will become big component
    }
    else {
      //
      console.log("SearchResults.render() - NO DOCS")
    }

    // if no docs --  ??
    // return (
    //  <div>
    //    <p>Type search...</p>
    //  </div>
    // )
    //
    console.log("SearchResults.render() - start="+start)

    // FIXME: should expand this to illustrate advanced search
    // e.g. (? AND ?) AND (? OR ?) and NOT .. etc...
    //
    //const query = searchFields ? searchFields.allWords : ''
    let query = solr.buildComplexQuery(searchFields)


    return (
      <section className="search-results">
        
        <SearchTabs></SearchTabs>
        <Loading isFetching={isFetching}></Loading>

        <h2>Query: {query}</h2>
        <h3>Results found: {numFound} </h3>
        <div className="search-results-table">
          {resultSet}
        </div>

        <PagingPanel></PagingPanel>

    </section>

  );
}

}

// FIXME: this is just returning the same state
// seems like no point in that, but otherwise says
// no property 'results' etc...
const mapStateToProps = (search) => {
  return  search;
}

// NOTE: doesn't seem to ever call unless I connect ...
//export default SearchResults

export default connect(mapStateToProps)(SearchResults);

// this doesn't seem to pass along state either
//export default connect()(SearchResults);
