import React, { Component, PropTypes } from 'react'

class Facets extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
        <div className="facet-block">
          {this.props.children}
        </div>
    )

  }
  
}


export default Facets

