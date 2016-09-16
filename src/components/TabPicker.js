import React from 'react'

import _ from 'lodash'

// NOTE: just a dumb trick so I can keep separate (for babel-node to run examples/example_*_.js files)
// but still only import something with the same name e.g. 'tabList'

// the reason is because PeopleTab requires css and SubjectHeadingsTab requires image files
// babel-node tries to read those as *.js files and fails
import { tabList as tabs } from './tabs/TabList'
export const tabList = tabs

import TabLoader from './tabs/TabLoader'

class TabPicker {

  // example usage:
  //
  // let tabPicker = new TabPicker("people")
  // let filterer = tabPicker.filterer
  // let displayer = tabPicker.displayer
  //
  constructor(filter) {
    this.filter = filter
    return new TabLoader(filter)
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

  /* shouldn't need this ever (I don't think?) */
  get tab() {
    return this._tab
  }

}


export default TabPicker

