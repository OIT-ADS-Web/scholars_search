//import React from 'react'

//import _ from 'lodash'

// NOTE: just a dumb trick so I can keep separate (for babel-node to run examples/example_*_.js files)
// but still only import one thing
//import { tabList as tabs } from './TabList'

//export const tabList = tabs

//export function findTab(name) {
//  let tab = _.find(tabList, function(tab) { return tab.id == name })
//  return tab
//}

//http://stackoverflow.com/questions/34655616/create-an-instance-of-a-class-in-es6-with-a-dynamic-name

/*
import PeopleTab from './PeopleTab'
import PublicationsTab from './PublicationsTab'
import OrganizationsTab from './OrganizationsTab'
import GenericTab from './GenericTab'
import ArtisticWorksTab from './ArtisticWorksTab'
import SubjectHeadingsTab from './SubjectHeadingsTab'
import GrantsTab from './GrantsTab'
import CoursesTab from './CoursesTab'
import OtherTab from './OtherTab'
*/

// NOTE: had to have this in a separate file so I could import it in babel-node environment
// e.g. in the examples/example_*.js scripts.  
//
// The {!tag=?} part is used to match the id to
// the filter - so they have to match and be there.  Otherwise we have to match on entire
// type:(*?) statement
//
export const tabList = [
  { id: "person", filter: "{!tag=person}type:(*Person)", label: "People", tabClass: "PeopleTab" },
  { id: "publications",  filter: "{!tag=publications}type:(*bibo/Document)", label: "Publications", tabClass: "PublicationsTab" },
  { id: "organizations",  filter: "{!tag=organizations}type:(*Organization)", label: "Organizations", tabClass: "OrganizationsTab" }, 
  { id: "grants",  filter: "{!tag=grants}type:(*Grant)", label: "Grants", tabClass: "GrantsTab" }, 
  { id: "courses",  filter: "{!tag=courses}type:(*Course)", label: "Courses", tabClass: "CoursesTab" },
  { id: "artisticworks",  filter: "{!tag=artisticworks}type:(*ArtisticWork)", label: "Artistic Works", tabClass: "ArtisticWorksTab" },
  { id: "subjectheadings", filter: "{!tag=subjectheadings}type:(*Concept)", label: "Subject Headings", tabClass: "SubjectHeadingsTab" },
  { id: "misc",  filter: "{!tag=misc}type:((*Award) OR (*Presentation) OR (*geographical_region) OR (*self_governing))",
    label: "Other", tabClass: "OtherTab"
  }
  /*
  { id: "misc",  filter: "{!tag=misc}type:(NOT((*Person) OR (*bibo/Document) OR (*Organization) OR (*Grant) OR (*Course) OR (*ArtisticWork) OR (*Concept)))",
   label: "Other"
  }
  */
]

