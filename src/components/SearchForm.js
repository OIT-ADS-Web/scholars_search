import React, { Component, PropTypes } from 'react'
import actions from '../actions/search'

require('../styles/forms.less');


export class SearchForm extends Component {

  constructor(props) {
    super(props)
    this.handleSubmitSearch = this.handleSubmitSearch.bind(this)
  }

  handleSubmitSearch(e) {
    e.preventDefault();
    if (this.textInput !== null) {
      const { dispatch } = this.props;
      // search = {
      //   'all': textInput1.value,
      //   'exact': textInput2.value,
      //   'atLeast': textInput3.value,
      //   'none': textInput4.value
      // }
      //dispatch(fetchSearch(search, 0));
    }
  }

  render() {
     //const { query, isFetching } = this.props;

    return (
        <form onSubmit={this.handleSubmitSearch}>
          <div className="form-group">
            <label>With all these words</label>
            <input type="text" ref={(ref) => this.textInput1 = ref} className="form-control"/>
          </div>
           <div className="form-group">
            <label>With the exact phrase</label>
            <input type="text" ref={(ref) => this.textInput2 = ref} className="form-control"/>
          </div>
           <div className="form-group">
            <label>With at least one of these words</label>
            <input type="text" ref={(ref) => this.textInput3 = ref} className="form-control"/>
          </div>
           <div className="form-group">
            <label>With none of these words</label>
            <input type="text" ref={(ref) => this.textInput4 = ref} className="form-control"/>
          </div>
          <button type="submit" className="btn btn-default">Submit</button>
        </form>
    )
  }

}
export default SearchForm

