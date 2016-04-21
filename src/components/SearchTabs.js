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

  constructor(props) {
    super(props);
    
    this.handlePersonTab = this.handlePersonTab.bind(this);
    this.handlePublicationsTab = this.handlePublicationsTab.bind(this);
    this.handleOrganizationsTab = this.handleOrganizationsTab.bind(this);
  }

  handlePersonTab(e) {
    e.preventDefault()
    const { search : { results, searchFields, start, filter }, dispatch } = this.props;

    // FIXME: don't really like this 
    dispatch(actions.filterSearch("person"));
    // can we do this here?
    dispatch(actions.fetchSearch(searchFields, 0, "person"));
    // NOTE: these should all probably reset page too
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
     const { search : {filter} } = this.props

     const { tabs : {grouped} } = this.props

     const namedFilters = solr.nameFilters

     // FIXME: too much duplicated code
     const personClasses = classNames({tab:true}, {selected: filter == 'person'})     
     const publicationsClasses = classNames({tab:true}, {selected: filter == 'publications'})     
     const organizationsClasses = classNames({tab:true}, {selected: filter == 'organizations'})     

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
     let pubCount = 'type:(*Publication)' in grouped ? grouped['type:(*Publication)'].doclist.numFound : 0
     let orgCount = 'type:(*Organization)' in grouped ? grouped['type:(*Organization)'].doclist.numFound : 0
     
    
     //let grantCount = 'type:(*Grant)' in grouped ? grouped['type:(*Grant)'].doclist.numFound : 0
     //let courseCount = 'type:(*Course)' in grouped ? grouped['type:(*Course)'].doclist.numFound : 0
     //let artisticWorksCount = 'type:(*Artistic)' in grouped ? grouped['type:(*Artistic)'].doclist.numFound : 0
     //let subjectHeadingsCount = 'type:(*Concept)' in grouped ? grouped['type:(*Concept)'].doclist.numFound : 0


    // FIXME: break out tabs into it's own component?

    return (
        <div className="tab-group">
          <div className={personClasses} onClick={this.handlePersonTab}>People ({peopleCount})</div> 
          <div className={publicationsClasses} onClick={this.handlePublicationsTab}>Publications ({pubCount})</div> 
          <div className={organizationsClasses}  onClick={this.handleOrganizationsTab}>Organizations ({orgCount})</div>
        </div>

      )
  }

}

// FIXME: this is just returning the same state
// seems like no point in that, but otherwise says
// no property 'results' etc...
const mapStateToProps = (tabs) => {
  return  tabs;
}

// NOTE: doesn't seem to ever call unless I connect ...
//export default SearchResults

export default connect(mapStateToProps)(SearchTabs);

// this doesn't seem to pass along state either
//export default connect()(SearchResults);
