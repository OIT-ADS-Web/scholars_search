import React from 'react';
import { render, unmountComponentAtNode  } from 'react-dom'
//import Root from './containers/Root';
import ScholarsSearch from './containers/ScholarsSearch'


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

