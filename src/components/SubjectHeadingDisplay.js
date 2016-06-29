import React, { Component } from 'react';

import HasSolrData from './HasSolrData'

import classNames from 'classnames'

import MeshLogo from '../images/meshhead.gif'
import LocLogo from '../images/loc-logo.png'
import DukeLogo from '../images/duke-text-logo.png'

class SubjectHeadingDisplay extends HasSolrData(Component) {

  constructor(props) {
    super(props);
    this.doc = this.props.doc;
    this.display = this.props.display;
  }

  render() {
    // D008515
    let meshMatch = /^https:\/\/scholars.duke.edu\/individual\/mesh*/
    let locMatch = /^http:\/\/id.loc.gov\/authorities\/subjects\/*/
 
    let uri = this.URI
    let isMesh = meshMatch.test(uri)
    let isLoc = locMatch.test(uri)
    
    let logo = function() {
      if (isMesh) {
         return MeshLogo
      } else if (isLoc) {
         return LocLogo 
      } else {
        return DukeLogo
      }
    }()

    return (
         <div className="generic search-result-row" key="{this.docId}">
            <div className="row">
              <div className="col-md-12 col-xs-12 col-sm-12"> 
                <strong><a href={this.URI}>{this.name}</a></strong>
                <div className="pull-right">
                   <img width="25px" src={logo}/>
                </div>
              </div>
            </div>
            
            {this.solrDocDisplay}
 
        </div>
    )
  }

}


export default SubjectHeadingDisplay
