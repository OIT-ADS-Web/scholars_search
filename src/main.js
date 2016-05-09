import React from 'react';
import { render, unmountComponentAtNode  } from 'react-dom'
import Root from './containers/Root';


module.exports = function(targetNode) {
  unmountComponentAtNode(targetNode)
  render (
      <Root />,
      targetNode
  )
}


/*
render(
  <Root />,
  document.getElementById('content')
)
*/

