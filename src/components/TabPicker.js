import React from 'react'

import _ from 'lodash'

import { tabList as tabs } from './tabs/TabLoader'

export const tabList = _.map(tabs, function(tab) {
  let instance = tab.instance
  return {id: instance.id, label: instance.label, filter: instance.filter}
})


import TabLoader from './tabs/TabLoader'

// NOTE: designed for centralizing search : { searchFields } access  
export function defaultTab(searchFields) {
  let filter = searchFields ? (searchFields['filter'] || 'person') : 'person'
  return filter
}

class TabPicker {

  // example usage:
  //
  // let tabPicker = new TabPicker("people")
  // let filterer = tabPicker.filterer
  // let displayer = tabPicker.displayer
  // let downloader = tabPicker.downloader
  //
  constructor(id) {
    return new TabLoader(id)
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

}


export default TabPicker

