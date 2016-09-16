import React, { Component, PropTypes } from 'react'

class Facets extends Component {

  static get contextTypes() {
    return({
      router: PropTypes.object
    })
  }

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


import { connect } from 'react-redux'


const mapStateToProps = (search) => {
  return search
}


export default connect(mapStateToProps)(Facets)

