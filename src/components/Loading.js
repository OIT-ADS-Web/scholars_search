import React, { Component, PropTypes } from 'react'

class Loading extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    const { isFetching } = this.props

      if (isFetching) {
        return (
            <div className="loading">Loading&#8230;</div>
        )
      } else {
        return (
            <span></span>
        )
      }
  }


}


export default Loading 



