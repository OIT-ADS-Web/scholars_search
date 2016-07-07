import React, { Component } from 'react'

class ScholarsLink extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    let {uri, text} = this.props
    console.log("Scholars Link")
    console.log("uri="+uri)
    console.log("text="+text)

    return (
      <a href={uri} target="_blank">
        <span dangerouslySetInnerHTML={{__html: text}}></span>
      </a>
    )
  }


}


export default ScholarsLink



