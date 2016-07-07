import React, { Component } from 'react';

// needed for thumbnail stuff, I guess
require('../styles/scholars_search.less');

import HasSolrData from './HasSolrData'
import ScholarsLink from './ScholarsLink'

class PersonDisplay extends HasSolrData(Component) {

  constructor(props) {
    super(props);
    this.doc = this.props.doc;
    this.display = this.props.display;
  }

  f(str) {
    return (str || "").replace(/&#039;/g,"'");
  }

  hasThumbnail() {
    let flag = false

    if (this.doc.THUMBNAIL != "0") {
      flag = true
    }

    return flag
  }

  
  get department() {
    // NOTE: department_search_text field can look like this:
    //
    //"department_search_text": [
    //  "\"Medicine, Cardiology\"",
    //  "Medicine",
    //  "Clinical Science Departments",
    //  "School of Medicine",
    //  "Duke Clinical Research Institute",
    //  "Institutes and Centers"
    //]
    // 
    let departmentText = ''
    if (this.doc.department_search_text) {
      departmentText = this.doc.department_search_text[0]
    }
    return departmentText.replace(/"/g, "")
  }
  
  get thumbnailUrl() {
    return this.doc.THUMBNAIL_URL
  }


  render() {

    let picture
    
    if (this.hasThumbnail()) {
      picture = <div className="crop"><img src={this.thumbnailUrl} className="profile-thumbnail"></img></div>
    } else {
      picture = <img className="profile-thumbnail"></img>
    }

    return (
         <div className="person search-result-row" key="{this.docId}">
            <div className="row">
              
              <div className="col-lg-1 col-md-12 col-xs-12 col-sm-12">
                {picture}
              </div>
            
              <div className="col-lg-11 col-md-12 col-xs-12 col-sm-12">
                <strong>
                  <ScholarsLink uri={this.URI} text={this.name} />
                </strong>
                <span> - {this.preferredTitle}</span>
                <div>{this.department}</div>
              </div>

            </div>

            <div className="row">
              <div className="col-lg-12 col-md-12 col-xs-12">
                <div className="highlight-text">
                  {this.highlightText(this.display)}
                </div>
              </div>
        
          </div>

           {this.solrDocDisplay}
 
      </div>

    )
  }

}


export default PersonDisplay
