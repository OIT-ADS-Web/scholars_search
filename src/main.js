import React from 'react';
import { render, unmountComponentAtNode  } from 'react-dom'
//import Root from './containers/Root';
import ScholarsSearch from './containers/ScholarsSearch'

//require ('jquery')
require ('bootstrap')

//require.context("./images/", true, /^\.\/.*\.png/);

//require ('./style/vivo_admin')

//require('./styles/vivo_admin.less')
//
//require("bootstrap-webpack!./bootstrap.config.js")

import 'jquery'
//import 'bootstrap'

module.exports = function(targetNode) {
  unmountComponentAtNode(targetNode)
  render (
      <ScholarsSearch />,
      targetNode
  )
}


/*
render(
  <Root />,
  document.getElementById('content')
)
*/

