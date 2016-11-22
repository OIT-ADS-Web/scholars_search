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

export function defaultChosenFacets(searchFields) {
  let chosen_ids = searchFields['facetIds'] ? searchFields['facetIds'] : []
    
  // have to convert to array if it's a single value. 
  // FIXME: there is probably a better way to do this
  if (typeof chosen_ids === 'string') {
    chosen_ids = [chosen_ids]
  }
  return chosen_ids
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

