import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

var _ = require('lodash');

import loadOrganizationsIfNeeded from '../actions/search'
import fetchOrgs from '../actions/search'

class OrganizationSidebar extends Component {


  //this.props.dispatch ( fetchUsersFromServer () );
  // import loadOrganizationsIfNeeded from '../actions/search'
  // 
  // dispatch(loadOrganizationsIfNeeded)
 
  constructor(props) {
    super(props);
    // FIXME: ??
    //this.props.dispatch (loadOrganizationsIfNeeded);
    //this.props.dispatch (fetchOrgs);
  }


  render() {

    const { orgs: orgs } = this.props //organizations;
    //const { orgs : organizations } = this.props;
    const { init: departments } = this.props // initial departments
    
    let resultSet = "";

    if (departments) {
      // ?
    }
    if (orgs) {

      const organizations = _.sortBy(orgs.organizations, function(o) {
        return o.name;
      });

      resultSet = organizations.map(org => <div><input type="checkbox" ref="{org.URI}" /> {org.name}</div> );
    }
    else {
      console.log("OrganizationSidebar.render() - NO ORGS")
    }

    //const { search: results } = this.props //organizations;
    const { search : { results } } = this.props;
 
   // 
    return (
          <section className="facets">
            <ul>
              {resultSet}
            </ul>
          </section>
   )
  }

  /* FIXME: this was code that counted ... need to integrate

            { departmentCounts.map(d => {
               return (
                 <li key={d.depth.toString() + "|" + d.uri}>
                   <a href="#" onClick={(e) => { e.preventDefault();this.setDepartmentFacet(d)}}>
                   {d.name} ({d.count})
                   </a>
                 </li>
               )
            })}
 
  parseDepartmentCounts() {
    var departments = this.state.searchResult.facet_counts.facet_fields.department_facet_string

    // get them in groups of 2
    var result = []
    var i = 0;
    while(i < departments.length){
      var depth,paths
      [ depth,...paths ] = departments[i].split("|")
      var uri = paths.pop()
      var org = this.state.organizations.find(org => org.URI == uri)
      var orgName = "unknown"
      if (org) {
        orgName = org.name
      }
      var count = departments[i+1]
      var nextFilter = departments[i].replace(/:/g,"\\:")
      var nextPrefixParts = [parseInt(depth)+1]
      if (paths.length > 0) nextPrefixParts.push(paths)
      nextPrefixParts.push(uri)
      var nextPrefix = nextPrefixParts.join("|")
      result.push({
        depth: parseInt(depth), uri: uri, count: count, name: orgName, nextFilter: nextFilter, nextPrefix: nextPrefix
      })
      i += 2;
    }
    return result
  }


  setDepartmentFacet(department) {
    this.props.solr.setFacetField("department_facet_string",{
      prefix: department.nextPrefix,
      mincont: 1
    }).setFilter("department","department_facet_string:" + department.nextFilter).execute().then(r => {
      var newDepartments = Array.from(this.state.departments)
      // if new then push, else we are backtracking so delete all after index of department
      var departmentIndex = newDepartments.indexOf(department);
      if (departmentIndex == -1) {
        newDepartments.push(department)
      } else {
        newDepartments = newDepartments.slice(0,departmentIndex + 1)
      }
      this.setState({searchResult: JSON.parse(r.response)})
      this.setState({departments: newDepartments})
    })
  }

  removeDepartmentFilter() {
    this.props.solr.setFacetField("department_facet_string",{
      prefix: "1|",
      mincont: 1
    }).deleteFilter("department").execute().then(r => {
      this.setState({searchResult: JSON.parse(r.response)})
      this.setState({departments: []})
    })
  }


  */


}


// FIXME: this is just returning the same state
// seems like no point in that, but otherwise says
// no property 'results'

const mapStateToProps = (orgs) => {
//  const { search } = state;
  return orgs ;
};

// NOTE: doesn't seem to ever call unless I connect ...
//export default SearchResults

export default connect(mapStateToProps)(OrganizationSidebar);

//export default OrganizationSidebar;


