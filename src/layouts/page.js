import React, { Component } from 'react'

require('../styles/vivo_admin.less')
//require('../styles/scholars_search.less')

export default class Page extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
        <div className="container">
          {this.props.children}
        </div>
    )

  }
}

