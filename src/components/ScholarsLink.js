import React, { Component } from 'react'

class ScholarsLink extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    let {uri, text} = this.props

    return (
      <a href={uri} target="_blank">
        <span dangerouslySetInnerHTML={{__html: text}}></span>
      </a>
    )
  }


}


export default ScholarsLink



