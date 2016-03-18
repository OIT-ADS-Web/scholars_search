import React, { Component, PropTypes } from 'react'
import actions from '../actions/search'

require('../styles/forms.less');


export class SearchForm extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
        <form>
          <div className="form-group">
            <label>With all these words</label>
            <input ref="searchTerm" className="form-control"/>
          </div>
           <div className="form-group">
            <label>With the exact phrase</label>
            <input ref="searchTerm" className="form-control"/>
          </div>
           <div className="form-group">
            <label>With at least one of these words</label>
            <input ref="searchTerm" className="form-control"/>
          </div>
           <div className="form-group">
            <label>With none of these words</label>
            <input ref="searchTerm" className="form-control"/>
          </div>
          <button type="submit" className="btn btn-default">Submit</button>
        </form>
    )
  }

}
export default SearchForm

