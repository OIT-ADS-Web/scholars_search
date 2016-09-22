import React, { Component } from 'react';

import HasSolrData from '../HasSolrData'
import ScholarsLink from '../ScholarsLink'

// NOTE: wanted to do this, but babel-node tries to interpret
//
//import meshLogo from '../../images/meshhead.gif'
//import locLogo from '../../images/loc-logo.png'
//import dukeLogo from '../../images/duke-text-logo.png'

class SubjectHeadingDisplay extends HasSolrData(Component) {

  constructor(props) {
    super(props);
    this.doc = this.props.doc;
    this.highlight = this.props.highlight
  }

  render() {
    let meshMatch = /^https:\/\/scholars.duke.edu\/individual\/mesh*/
    let locMatch = /^http:\/\/id.loc.gov\/authorities\/subjects\/*/
 
    let uri = this.URI
    let isMesh = meshMatch.test(uri)
    let isLoc = locMatch.test(uri)

    let logo = function() {
      if (isMesh) {
        return require('../../images/meshhead.gif')
      } else if (isLoc) {
        return require('../../images/loc-logo.png')
      } else {
        return require('../../images/duke-text-logo.png')
      }
    }()

    if (isLoc) {
      uri = `https://scholars.duke.edu/individual?uri=${encodeURIComponent(this.URI)}`
    }

    return (
         <div className="generic search-result-row" key="{this.docId}">
            <div className="row">
              <div className="col-md-12 col-xs-12 col-sm-12"> 
                 <strong>
                  <ScholarsLink uri={uri} text={this.name} />
                </strong>
                <div className="pull-right">
                   <img width="18px" src={logo}/>
                </div>
              </div>
            </div>
            
            {this.solrDocDisplay}
 
        </div>
    )
  }

}

import Tab from '../Tab'
import { TabDisplayer, TabDownloader, TabFilterer } from '../Tab'

class SubjectHeadingsTabDisplayer extends TabDisplayer {

  individualDisplay(doc, highlight) {
    return <SubjectHeadingDisplay key={doc.DocId} doc={doc} highlight={highlight}/> 
  }

}

class SubjectHeadingsTab extends Tab  {

  constructor() {
    super()

    this.id = "subjectheadings"
    this.filter = "{!tag=subjectheadings}type:(*Concept)"
    this.label = "Subject Headings"
 
    this.displayer = new SubjectHeadingsTabDisplayer()
  
    let fields = [{label: 'Name', value: 'nameRaw.0'}]
    this.downloader = new TabDownloader(fields)
  }


}

export default SubjectHeadingsTab

