import React, { Component } from 'react'

import SearchField from './SearchField'

export default class SearchFieldHidden extends SearchField {

  // NOTE: this is here merely to handle the advanced=true param (to create the
  // advanced search form via ?advanced=true request
  render() {
    const { defaultValue} = this.props

    return (
      <input onBlur = {this.handleBlur} type="text" ref="myInput" className="hidden"  />
    )

  }

}

