import React, { Component } from 'react'

// need this for the 'fetching' image
require('../styles/scholars_search.less');

class Loading extends Component {

  constructor(props) {
    super(props)
  }

  render() {

    const { isFetching } = this.props

      if (isFetching) {
        return (
            <div className="row">
              <span className="bg-danger loading-image" aria-label="loading results"></span>
            </div>
        )
      } else {
        return (
            <div className="not-loading">
            </div>
        )
      }
  }


}


export default Loading 



