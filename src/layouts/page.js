import React, { Component } from 'react'

import Header from './header'
import Navbar from './navbar'
import Footer from './footer'

require('../styles/vivo_admin.less')

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



/*

export default (props) => (
    <div className="container">
        {props.children}
    </div>

)

*/

