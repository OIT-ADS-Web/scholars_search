import React, { Component, PropTypes } from 'react'
import actions from '../actions/search'

export class SearchForm extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
        <form>
          <label>
             Search:
             <input ref="searchTerm"/>
             <input type="submit"/>
          </label>
        </form>
    )
  }

}
export default SearchForm

