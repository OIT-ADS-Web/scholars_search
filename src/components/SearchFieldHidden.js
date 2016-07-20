import React, { Component } from 'react'

import SearchField from './SearchField'

export default class SearchFieldHidden extends SearchField {

  render() {
    const { defaultValue} = this.props

    return (
      <input onBlur = {this.handleBlur} type="text" ref="myInput" className="hidden"  />
    )

  }

}

