import React from 'react'

import { render, unmountComponentAtNode  } from 'react-dom'
import ScholarsSearch from './containers/ScholarsSearch'

require ('bootstrap')

import 'jquery'

import "babel-polyfill"


// NOTE: wanted to require this in particular tabs
// but babel-node tries to parse *.less as *.js file
require('./styles/scholars_search.less');

// import 
module.exports = function(targetNode) {
  unmountComponentAtNode(targetNode)
  render (
      <ScholarsSearch />,
      targetNode
  )
}


