import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames'

import actions from '../actions/search'

// FIXME: we don't want to do the actual SolrQuery here,
// so this should be something more like
// import solr from '../SolrConfig' e.g. site specific
// utils and such
import solr from '../utils/SolrQuery'

// NOTE: props are sent to components
class SearchTabs extends Component {

  // FIXME: don't necessarily like this down at SearchForm
  // level just to get at router and add values to router
  // so they go into state
  static get contextTypes() {
    return({
        router: PropTypes.object
    })
  }

  constructor(props, context) {
    super(props, context);
    
    this.handlePersonTab = this.handlePersonTab.bind(this);
    this.handlePublicationsTab = this.handlePublicationsTab.bind(this);
    this.handleOrganizationsTab = this.handleOrganizationsTab.bind(this);

    this.handleGrantsTab = this.handleGrantsTab.bind(this);
    this.handleCoursesTab = this.handleCoursesTab.bind(this);
    this.handleArtisticWorksTab = this.handleArtisticWorksTab.bind(this);
    this.handleSubjectHeadingsTab = this.handleSubjectHeadingsTab.bind(this);

    this.handleMiscTab = this.handleMiscTab.bind(this);


  }

  resetPage(dispatch, searchFields, filter) {

    // FIXME: this seems wrong to me
    dispatch(actions.resetPage());

    searchFields['start'] = 0 

    searchFields['filter'] = filter

    this.context.router.push({
      pathname: '/',
      query: searchFields
    })
   
 
  }

  // FIXME: ideally not have to have a different method for every tab - just a generic
  // handleTab() --
  handlePersonTab(e) {
    e.preventDefault()
    const { search : { results, searchFields, start, filter }, dispatch } = this.props;

    // FIXME: don't really like this 
    dispatch(actions.filterSearch("person"));
    // can we do this here?
    dispatch(actions.fetchSearch(searchFields, 0, "person"));

    this.resetPage(dispatch, searchFields, "person")  
  }
  
  handlePublicationsTab(e) {
    e.preventDefault()
    const { search : { results, searchFields, start, filter }, dispatch } = this.props;

    // FIXME: no point in this - just repeating right after
    dispatch(actions.filterSearch("publications"));
    dispatch(actions.fetchSearch(searchFields, 0, "publications"));
    
    this.resetPage(dispatch, searchFields, "publications")  
  }

  handleOrganizationsTab(e) {
    e.preventDefault()
    const { search : { results, searchFields, start, filter }, dispatch } = this.props;

    dispatch(actions.filterSearch("organizations"));
    dispatch(actions.fetchSearch(searchFields, 0, "organizations"));
    this.resetPage(dispatch, searchFields, "organizations")  
  }

  handleGrantsTab(e) {
    e.preventDefault()
    const { search : { results, searchFields, start, filter }, dispatch } = this.props;

    dispatch(actions.filterSearch("grants"));
    dispatch(actions.fetchSearch(searchFields, 0, "grants"));
    this.resetPage(dispatch, searchFields, "grants")  
  }
  
  handleCoursesTab(e) {
    e.preventDefault()
    const { search : { results, searchFields, start, filter }, dispatch } = this.props;

    dispatch(actions.filterSearch("courses"));
    dispatch(actions.fetchSearch(searchFields, 0, "courses"));
    this.resetPage(dispatch, searchFields, "courses")  
  }

  handleArtisticWorksTab(e) {
    e.preventDefault()
    const { search : { results, searchFields, start, filter }, dispatch } = this.props;

    dispatch(actions.filterSearch("artisticworks"));
    dispatch(actions.fetchSearch(searchFields, 0, "artisticworks"));
    this.resetPage(dispatch, searchFields, "artisticworks")  
  }
  
  handleSubjectHeadingsTab(e) {
    e.preventDefault()
    const { search : { results, searchFields, start, filter }, dispatch } = this.props;

    dispatch(actions.filterSearch("subjectheadings"));
    dispatch(actions.fetchSearch(searchFields, 0, "subjectheadings"));
    this.resetPage(dispatch, searchFields, "subjectheadings")  
  }

  handleMiscTab(e) {
    e.preventDefault()
    const { search : { results, searchFields, start, filter }, dispatch } = this.props;

    dispatch(actions.filterSearch("misc"));
    dispatch(actions.fetchSearch(searchFields, 0, "misc"));
    this.resetPage(dispatch, searchFields, "misc")  
  }
  
  render() {
     const { search : {filter} } = this.props

     // filter ???
     //     dispatch(actions.filterSearch("publications"));
 
     const { tabs : {grouped} } = this.props

     const namedFilters = solr.nameFilters

     // FIXME: too much duplicated code
     const personClasses = classNames({active: filter == 'person'})     
     const publicationsClasses = classNames({active: filter == 'publications'})     
     const organizationsClasses = classNames({active: filter == 'organizations'})     

     const grantsClasses = classNames({active: filter == 'grants'})     
     const coursesClasses = classNames({active: filter == 'courses'})     
     const artisticWorksClasses = classNames({active: filter == 'artisticworks'})     
     const subjectHeadingsClasses = classNames({active: filter == 'subjectheadings'})     

     const miscClasses = classNames({active: filter == 'misc'})     


     // FIXME: this has several problems 
     // a) doesn't handle key existing but not 'doclist'
     // b) requies to much solr inside knowledge
     // c) similarly too coupled to implementation that exists in other code in the project
     // d) ../actions/search.js - adds the tabs (in #fetchTabCounts method - so have to keep synchronized
     //    with this.  Would be better configured in one place elsewhere, maybe a FilterTab Component?
 
     // e) dont want keys to look like type:(*Person) - just "person"
     //
     //
     let peopleCount = 'type:(*Person)' in grouped ? grouped['type:(*Person)'].doclist.numFound : 0
     let pubsCount = 'type:(*AcademicArticle)' in grouped ? grouped['type:(*AcademicArticle)'].doclist.numFound : 0
     let orgsCount = 'type:(*Organization)' in grouped ? grouped['type:(*Organization)'].doclist.numFound : 0
     
    
     let grantsCount = 'type:(*Grant)' in grouped ? grouped['type:(*Grant)'].doclist.numFound : 0
     let coursesCount = 'type:(*Course)' in grouped ? grouped['type:(*Course)'].doclist.numFound : 0
     let artisticWorksCount = 'type:(*ArtisticWork)' in grouped ? grouped['type:(*ArtisticWork)'].doclist.numFound : 0
     let subjectHeadingsCount = 'type:(*Concept)' in grouped ? grouped['type:(*Concept)'].doclist.numFound : 0

     // NOTE: this key will be large and change based on the others e.g.
     // (NOT((*Publication) OR (*Person) AND ... ))
     //let miscCount = 'type:(*Concept)' in grouped ? grouped['type:(*Concept)'].doclist.numFound : 0
     let miscKey = "type:(NOT((*Person) OR (*AcademicArticle) OR (*Organization) OR (*Grant) OR (*Course) OR (*ArtisticWork) OR (*Concept)))"

     let miscCount = miscKey in grouped ? grouped[miscKey].doclist.numFound: 0


     //"http://purl.org/ontology/bibo/Journal",
     //"http://purl.org/ontology/bibo/Periodical"

    // FIXME: break out tabs into it's own component?

    return (
        <ul className="nav nav-pills">
          <li className={personClasses}><a href="#" onClick={this.handlePersonTab}>People ({peopleCount})</a></li> 
          <li className={publicationsClasses}><a href="#" onClick={this.handlePublicationsTab}>Publications ({pubsCount})</a></li> 
          <li className={organizationsClasses}><a href="#" onClick={this.handleOrganizationsTab}>Organizations ({orgsCount})</a></li>
          
          <li className={grantsClasses}><a href="#" onClick={this.handleGrantsTab}>Grant ({grantsCount})</a></li> 
          <li className={coursesClasses}><a href="#" onClick={this.handleCoursesTab}>Courses ({coursesCount})</a></li> 
          <li className={artisticWorksClasses}><a href="#" onClick={this.handleArtisticWorksTab}>Artistic Works ({artisticWorksCount})</a></li>
          <li className={subjectHeadingsClasses}><a href="#" onClick={this.handleSubjectHeadingsTab}>Subject Headings ({subjectHeadingsCount})</a></li>
           
          <li className={miscClasses}><a href="#" onClick={this.handleMiscTab}>Misc ({miscCount})</a></li>
        </ul>

      )
  }

}

// FIXME: this is just returning the same state
// seems like no point in that, but otherwise says
// no property 'results' etc...
const mapStateToProps = (tabs, ownProps) => {
//const mapStateToProps = (tabs) => {
  return  tabs;
}

// NOTE: doesn't seem to ever call unless I connect ...
//export default SearchResults

export default connect(mapStateToProps)(SearchTabs);

// this doesn't seem to pass along state either
//export default connect()(SearchResults);
