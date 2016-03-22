import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { PAGE_ROWS } from '../actions/search'
import { nextPage, fetchSearch } from '../actions/search'

import PersonDisplay from './PersonDisplay'


class SearchResults extends Component {

  /*
    static get defaultProps() {
    return {
      search : { 
        results: { num 
        // stuff you want :)
    }
  }
  */


  constructor(props) {
    super(props);
    this.handleNextPage = this.handleNextPage.bind(this);
  }

  handleNextPage(e) {
    e.preventDefault();
    const { dispatch, search: { query, start } } = this.props;

    // FIXME: need to recreate compoundSearch ... from URL params?
    //
    //dispatch(actions.fetchSearch(compoundSearch, 0))
     
    //dispatch(actions.nextPage());
    //console.log(`....----> query: ${query} / ${start}`);
    //dispatch(fetchSearch(query, start));
  }
  
  render() {
    /*
    if (this.props.search == undefined) {
      console.log("SearchResults.render() - props.search == undefined")

      return (
          <div>
          </div>
      )
    }
    */


    const { search : { results } } = this.props;
    //console.log("SearchResults.render()")
    //console.log(this.props)


    //if (this.props.search.results == undefined) {
    //  console.log("SearchResults.render() - search.results == undefined")
    //
    //  return (
    //      <div>
    //      </div>
    //  )
    //}


    //    xr.get(config.org_url).then(r => this.setState({organizations: JSON.parse(r.response)}))
 

    let { numFound=0,docs,start=0 } = results;
    
    let resultSet = "";


    // NOTE: this will change depending on type e.g.
    // <PublicationDisplay ..
    // <PersonDisplay ..
    // etc...
    if (docs) {
      resultSet = docs.map(doc => <PersonDisplay key={doc.path} doc={doc} /> );
      // sidebar = ... <FacetSidebar />
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
    return (
      <section>
        <h3>Results found: {numFound} </h3>
        <ul>
          {resultSet}
        </ul>
        <div>{page}</div>
      </section>

    );
  }
  
}

/*
 *
  // parseHighlighting
  render() {
    var docs = this.state.searchResult.response.docs
    var departmentCounts = this.parseDepartmentCounts.bind(this)()
    var selectedDepartments = Array.from(this.state.departments)
    var currentDepartment = selectedDepartments.pop()
    var departmentBreadCrumbs = []
    var setDepartmentFacet = this.setDepartmentFacet;
    var removeDepartmentFilter = this.removeDepartmentFilter

      // highlighting looks like this:
      // {"vitroIndividual:https://scholars.duke.edu/individual/per4284062":
      // {"ALLTEXT":[" Nucleus Models, Biological GTP-Binding Proteins Mutagenesis, Insertional Endoplasmic Reticulum Genes <strong>Gram-Positive</strong> Bacterial Infections Active Transport, Cell Nucleus"]}}
 
    
    //var highlighting = this.state.searchResult.response.highlighting
    //console.log(this.state.searchResult.response)

    selectedDepartments.forEach(sd => departmentBreadCrumbs.push(<span key={"bc_" + sd.uri}><a href="#" onClick={function(e){ e.preventDefault(); setDepartmentFacet(sd)}}>{sd.name}</a> &rarr; </span>))
    if (currentDepartment) {
      departmentBreadCrumbs.push(<span key={"bc_" + currentDepartment.uri}>{currentDepartment.name}</span>)
      departmentBreadCrumbs.push(<span key={"remove_dept_filter" + currentDepartment.uri}><a onClick={function(e){ e.preventDefault(); removeDepartmentFilter()}}> &otimes; </a></span>)
    }

    return(
      <div className="wrapper">
        <h1>Find People</h1>
        <section className="search-form">
          <input type="text" onChange={this.setQuery.bind(this)}/>
          <button onClick={this.executeQuery.bind(this)}>search</button>
        </section>
        <section className="search-summary">
          <div>Query: {this.state.query}</div>
          <div>
            Department: {departmentBreadCrumbs}
          </div>
        </section>
        <section className="search-results">
          <section className="people">
          <ul>
          {docs.map( doc => {
             return (
                 <li key={doc.DocId}>
                  <div>
                    <strong>{doc.nameRaw[0]}</strong>
                    <span> - {doc.PREFERRED_TITLE}</span>
                    <div>{doc.DocId}</div>
                  </div>
                 </li>
             )
          })}
          </ul>
          </section>
          <section className="facets">
            <ul>
            { departmentCounts.map(d => {
               return (
                 <li key={d.depth.toString() + "|" + d.uri}>
                   <a href="#" onClick={(e) => { e.preventDefault();this.setDepartmentFacet(d)}}>
                   {d.name} ({d.count})
                   </a>
                 </li>
               )
            })}
            </ul>
          </section>
        </section>
      </div>
    )
  }
}
*/

// FIXME: this is just returning the same state
// seems like no point in that, but otherwise says
// no property 'results'
const mapStateToProps = (search) => {
//  const { search } = state;
  return  search ;
};

// NOTE: doesn't seem to ever call unless I connect ...
//export default SearchResults

export default connect(mapStateToProps)(SearchResults);

// this doesn't seem to pass along state
//export default connect()(SearchResults);
