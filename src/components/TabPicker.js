import React from 'react'

import PeopleTab from './PeopleTab'
import PublicationsTab from './PublicationsTab'
import OrganizationsTab from './OrganizationsTab'
import GenericTab from './GenericTab'
import ArtisticWorksTab from './ArtisticWorksTab'
import SubjectHeadingsTab from './SubjectHeadingsTab'
import GrantsTab from './GrantsTab'
import CoursesTab from './CoursesTab'
import OtherTab from './OtherTab'

import { tabList, findTab } from '../tabs'

// FIXME: name TabRouter instead ????
//
// FIXME: define findTab in this file - just have 'tabs.js' be a 
// list of defined tabs, period??
//
class TabPicker {


  constructor(filter) {
    this.filter = filter

    let config = findTab(filter)

    // makes this be a router, or thin wrapper of sorts - there's probably a 
    // design pattern name for this
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
    default:  
      this._tab = new GenericTab({})
    }
  }

  get tab() {
    return this._tab
  }

}


export default TabPicker
