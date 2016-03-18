import React from 'react'

export default (props) => (
  <div>
    <div id="wrapper" className="page-wrap">
      <header className="main-header">
        <h1>{props.title}</h1>
      </header>
      <div id="main" className="content">
      {props.children}
      </div>
      <footer>Footer Content</footer>
    </div>
  </div>
)
