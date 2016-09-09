import React from 'react'

// NOTE: just a dumb trick so I can keep separate (for babel-node to run examples/example_*_.js files)
// but still only import one thing
import { tabList as tabs } from './TabList'

export const tabList = tabs

import _ from 'lodash'

export function findTab(name) {
  let tab = _.find(tabList, function(tab) { return tab.id == name })
  return tab
}
 
import PeopleTab from './PeopleTab'
import PublicationsTab from './PublicationsTab'
import OrganizationsTab from './OrganizationsTab'
import GenericTab from './GenericTab'
import ArtisticWorksTab from './ArtisticWorksTab'
import SubjectHeadingsTab from './SubjectHeadingsTab'
import GrantsTab from './GrantsTab'
import CoursesTab from './CoursesTab'
import OtherTab from './OtherTab'


// FIXME: name TabRouter instead ????
//
// FIXME: define findTab in this file - just have 'tabs.js' be a 
// list of defined tabs, period??
//
class TabPicker {

  constructor(filter) {
    this.filter = filter

    /// FIXME: this makes a new object every time - should probably not do that
    //
    let config = findTab(filter)

    // makes this be a router, or thin wrapper of sorts - there's probably a 
    // design pattern name for this
    switch(this.filter) {
    case 'person':
      // FIXME: would like to maybe do something like this:
      // return (<PeopleTabComponent />)
      //
      this._tab = new PeopleTab(config)
      break
    case 'publications':
      this._tab = new PublicationsTab(config)
      break
    case 'organizations':  
      this._tab = new OrganizationsTab(config)
      break
    case 'subjectheadings':  
      this._tab = new SubjectHeadingsTab(config)
      break
    case 'artisticworks':  
      this._tab = new ArtisticWorksTab(config)
      break
    case 'grants':  
      this._tab = new GrantsTab(config)
      break
    case 'courses':  
      this._tab = new CoursesTab(config)
      break
    case 'other':
      this._tab = new OtherTab(config)
      break
    case 'misc':
      this._tab = new OtherTab(config)
      break
    default:  
      this._tab = new GenericTab({})
    }
  }

  get tab() {
    return this._tab
  }

}


export default TabPicker


/*
FIXME: tried to do something like this, but ran into problems:

import PeopleTab from './components/PeopleTab'
import PublicationsTab from './components/PublicationsTab'
import OrganizationsTab from './components/OrganizationsTab'
import ArtisticWorksTab from './components/ArtisticWorksTab'
import SubjectHeadingsTab from './components/SubjectHeadingsTab'
import GrantsTab from './components/GrantsTab'
import CoursesTab from './components/CoursesTab'
import OtherTab from './components/OtherTab'

let tabs = {}
tabs["person"] = new PeopleTab({id: "person", filter: "{!tag=person}type:(*Person)", label: "People" })
tabs["publications"] = new PublicationsTab({ id: "publications",  filter: "{!tag=publications}type:(*bibo/Document)", label: "Publications" })
tabs["organizations"] = new OrganizationsTab({ id: "organizations",  filter: "{!tag=organizations}type:(*Organization)", label: "Organizations" }) 
tabs["grants"] = new GrantsTab({ id: "grants",  filter: "{!tag=grants}type:(*Grant)", label: "Grants" })
tabs["courses"] = new CoursesTab({ id: "courses",  filter: "{!tag=courses}type:(*Course)", label: "Courses" })
tabs["artisticworks"] = new ArtisticWorksTab({ id: "artisticworks",  filter: "{!tag=artisticworks}type:(*ArtisticWork)", label: "Artistic Works" })
tabs["subjectheadings"] = new SubjectHeadingsTab({ id: "subjectheadings", filter: "{!tag=subjectheadings}type:(*Concept)", label: "Subject Headings" })
tabs["others"] = new OtherTab({ id: "misc",  filter: "{!tag=misc}type:(NOT((*Person) OR (*bibo/Document) OR (*Organization) OR (*Grant) OR (*Course) OR (*ArtisticWork) OR (*Concept)))", label: "Other"})

export const TABS = tabs
*/

