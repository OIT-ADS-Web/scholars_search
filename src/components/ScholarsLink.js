import React, { Component } from 'react'

class ScholarsLink extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    let {uri, text} = this.props

    let env = process.env.NODE_ENV

    if (env == 'acceptance') {
      uri = uri.replace('https://scholars.duke.edu', 'https://scholars2-test.oit.duke.edu')
    } else if (env == 'development') {
      uri = uri.replace('https://scholars.duke.edu', 'http://localhost')
    }


    return (
      <a href={uri} target="_blank">
        <span dangerouslySetInnerHTML={{__html: text}}></span>
      </a>
    )
  }


}


export default ScholarsLink



