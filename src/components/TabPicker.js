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

//http://stackoverflow.com/questions/34655616/create-an-instance-of-a-class-in-es6-with-a-dynamic-name
/*
 *
import PeopleTab from './PeopleTab'
import PublicationsTab from './PublicationsTab'
import OrganizationsTab from './OrganizationsTab'
import GenericTab from './GenericTab'
import ArtisticWorksTab from './ArtisticWorksTab'
import SubjectHeadingsTab from './SubjectHeadingsTab'
import GrantsTab from './GrantsTab'
import CoursesTab from './CoursesTab'
import OtherTab from './OtherTab'

const tabClasses = {
  PeopleTab,
  PublicationsTab,
  OrganizationsTab,
  GenericTab,
  ArtisticWorksTab,
  SubjectHeadingsTab,
  GrantsTab,
  CoursesTab,
  OtherTab
}

class DynamicTab {
    constructor (className, opts) {
        return new tabClasses[className](opts)
    }
}

switch(filter)
  case "people" --> DynamicTab("PeopleTab") e.g. DynamicTab(initialCap(filter) + "Tab")

*/

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

  // example:
  //
  // let tabPicker = new TabPicker("people")
  // let tab = tabPicker.tab
  // let filterer = tabPicker.filterer
  // let displayer = tabPicker.displayer
  //
  constructor(filter) {
    this.filter = filter

    /// FIXME: this makes a 'new' object every time - should probably not do that
    let config = findTab(filter)

    switch(this.filter) {
    case 'person':
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

  
  get filterer() {
    return this._tab.filterer
  }

  get displayer() {
    return this._tab.displayer
  }

  get downloader() {
    return this._tab.downloader
  }

  get tab() {
    return this._tab
  }

}


export default TabPicker

