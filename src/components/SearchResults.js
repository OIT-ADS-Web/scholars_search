import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { Link } from 'react-router'

/* our stuff */
import { PAGE_ROWS } from '../actions/search'
import actions from '../actions/search'

import PersonDisplay from './PersonDisplay'
// NOTE: this is to get the text output of the search
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
    
    this.handlePersonTab = this.handlePersonTab.bind(this);
    this.handlePublicationsTab = this.handlePublicationsTab.bind(this);
    this.handleOrganizationsTab = this.handleOrganizationsTab.bind(this);


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


  handlePersonTab(e) {
    e.preventDefault()
    const { search : { results, searchFields, start, filter }, dispatch } = this.props;

    // FIXME: don't really like this 
    dispatch(actions.filterSearch("people"));
    dispatch(actions.fetchSearch(searchFields, 0, "people"));
  }
  
  handlePublicationsTab(e) {
    e.preventDefault()
    const { search : { results, searchFields, start, filter }, dispatch } = this.props;

    // FIXME: no point in this - just repeating right after
    dispatch(actions.filterSearch("publications"));
    dispatch(actions.fetchSearch(searchFields, 0, "publications"));
  }

  handleOrganizationsTab(e) {
    e.preventDefault()
    const { search : { results, searchFields, start, filter }, dispatch } = this.props;

    dispatch(actions.filterSearch("organizations"));
    dispatch(actions.fetchSearch(searchFields, 0, "organizations"));
  }
  
  render() {

    // so start should be coming from search object (state)
    const { search : { results, searchFields, start=0, filter } } = this.props;

    // FIXME: how to initial this from routes?
    // search is undefined
    //if (!search.searchFields) {
       //searchFields = this.context.router.query --
    //}

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

          return <PersonDisplay key={doc.path} doc={doc} display={display}/> 
      });
      // sidebar = ... <FacetSidebar />  --- likely will become big component
    }
    else {
      //
      console.log("SearchResults.render() - NO DOCS")
    }

    console.log("SearchResults.render() - start="+start)


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
     * <PagingPanel count={count} page={page} onNextPage={() => {
            changePage(page+1);
            fetchResults()
        }} onPreviousPage={ () => {
            changePage(page-1);
            fetchResults()
        }} />

     const personClasses = classNames({tab:true}, {selected: filter == 'people'})     
 
    */

    // FIXME: too much duplicated code
     const personClasses = classNames({tab:true}, {selected: filter == 'people'})     
     const publicationsClasses = classNames({tab:true}, {selected: filter == 'publications'})     
     const organizationsClasses = classNames({tab:true}, {selected: filter == 'organizations'})     
 
    return (
      <section className="search-results">
        <div className="tab-group">
          <div className={personClasses} onClick={this.handlePersonTab}>People</div> 
          <div className={publicationsClasses} onClick={this.handlePublicationsTab}>Publications</div> 
          <div className={organizationsClasses}  onClick={this.handleOrganizationsTab}>Organizations</div>
        </div>

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
}

// NOTE: doesn't seem to ever call unless I connect ...
//export default SearchResults

export default connect(mapStateToProps)(SearchResults);

// this doesn't seem to pass along state either
//export default connect()(SearchResults);
