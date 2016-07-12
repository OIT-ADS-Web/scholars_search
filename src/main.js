import React from 'react'

import { render, unmountComponentAtNode  } from 'react-dom'
import ScholarsSearch from './containers/ScholarsSearch'

require ('bootstrap')

import 'jquery'

module.exports = function(targetNode) {
  unmountComponentAtNode(targetNode)
  render (
      <ScholarsSearch />,
      targetNode
  )
}


