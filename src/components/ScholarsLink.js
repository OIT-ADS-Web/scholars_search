import React, { Component } from 'react'

class ScholarsLink extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    let {uri, text} = this.props

    let env = process.env.NODE_ENV

    console.log(`trying to create link with ${uri}`)

    // NOTE: strangely this is occassionally not a string
    // or null or something  - so it throws an error
    // "replace() is not a function" (or something like that)
    uri = String(uri)
    
    console.log(`link before replace ${uri}`)

    if (env == 'acceptance') {
      uri = uri.replace('https://scholars.duke.edu', 'https://scholars2-test.oit.duke.edu')
    } else if (env == 'development') {
      uri = uri.replace('https://scholars.duke.edu', 'http://localhost')
    }


     console.log(`link after replace ${uri}`)


    return (
      <a href={uri} target="_blank">
        <span dangerouslySetInnerHTML={{__html: text}}></span>
      </a>
    )
  }


}


export default ScholarsLink



