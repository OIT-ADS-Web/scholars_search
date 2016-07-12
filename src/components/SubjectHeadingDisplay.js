import React, { Component } from 'react';

import HasSolrData from './HasSolrData'
import ScholarsLink from './ScholarsLink'

import meshLogo from '../images/meshhead.gif'
import locLogo from '../images/loc-logo.png'
import dukeLogo from '../images/duke-text-logo.png'

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
        return meshLogo
      } else if (isLoc) {
        return locLogo 
      } else {
        return dukeLogo
      }
    }()

    return (
         <div className="generic search-result-row" key="{this.docId}">
            <div className="row">
              <div className="col-md-12 col-xs-12 col-sm-12"> 
                 <strong>
                  <ScholarsLink uri={this.URI} text={this.name} />
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


export default SubjectHeadingDisplay
