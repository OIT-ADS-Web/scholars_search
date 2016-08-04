import React from 'react'

import PeopleTab from './PeopleTab'
import PublicationsTab from './PublicationsTab'
import OrganizationsTab from './OrganizationsTab'
import GenericTab from './GenericTab'
import ArtisticWorksTab from './ArtisticWorksTab'
import { SubjectHeadingsTab } from './SubjectHeadingsTab'
import GrantsTab from './GrantsTab'
import CoursesTab from './CoursesTab'

class TabPicker {

  constructor(filter) {
    this.filter = filter

    // makes this be a router, or thin wrapper of sorts 
    switch(this.filter) {
    case 'person':
      this.tab = new PeopleTab()
      break
    case 'publications':
      this.tab = new PublicationsTab()
      break
    case 'organizations':  
      this.tab = new OrganizationsTab()
      break
    case 'subjectheadings':  
      this.tab = new SubjectHeadingsTab()
      break
    case 'artisticworks':  
      this.tab = new ArtisticWorksTab()
      break
    case 'grants':  
      this.tab = new GrantsTab()
      break
    case 'courses':  
      this.tab = new CoursesTab()
      break
    default:  
      this.tab = new GenericTab()
    }
  }

  toCSV(json) {
    return this.tab.toCSV(json)
  }

  results(docs, highlighting) {
    return this.tab.results(docs, highlighting)
  }


  facets(query, facet_queries, chosen_ids=[], cb=null) {
    return this.tab.facets(query, facet_queries, chosen_ids, cb)
  }

  sortOptions() {
    return this.tab.sortOptions()
  }


  filterQueries(base_qry) {
    return this.tab.filterQueries(base_qry)
  }


  facetQueries(base_qry) {
    return this.tab.facetQueries(base_qry)
  }

  findFilterMatches(base_query, filter_queries) {
    return this.tab.findFilterMatches(base_query, filter_queries)
  }


}


export default TabPicker
