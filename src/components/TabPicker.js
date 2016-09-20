import React from 'react'

import _ from 'lodash'

import { tabList as tabs } from './tabs/TabLoader'

export const tabList = _.map(tabs, function(tab) {
  let instance = new tab.clz()
  console.log(instance)
  return {id: instance.id, label: instance.label, filter: instance.filter}
})

//export const tabList = tabs

import TabLoader from './tabs/TabLoader'

class TabPicker {

  // example usage:
  //
  // let tabPicker = new TabPicker("people")
  // let filterer = tabPicker.filterer
  // let displayer = tabPicker.displayer
  // 
  // note "filter" is just an id, like "people", "organizations" etc...
  // not an actual filter
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

