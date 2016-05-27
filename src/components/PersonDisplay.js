import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

// needed for thumbnail stuff, I guess
require('../styles/scholars_search.less');

import HasSolrData from './HasSolrData'

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
    var flag = false

    if (this.doc.THUMBNAIL != "0") {
      flag = true
    }

    return flag
  }

  get thumbnailUrl() {
    return this.doc.THUMBNAIL_URL
  }


  render() {

    var picture
    
    if (this.hasThumbnail()) {
      picture = <div className="crop"><img src={this.thumbnailUrl} className="profile-thumbnail"></img></div>
    } else {
      picture = <img className="profile-thumbnail"></img>
    }

    // even this crashes
    //let highlight = this.highlightText(this.display)
    //console.log(highlight)

    return (
         <div className="person search-result-row" key="{this.docId}">
            <div className="row">
              
              <div className="col-md-1">
                {picture}
              </div>
            
              <div className="col-md-10">
                <strong><a href={this.URI}>{this.name}</a></strong>
                <span> - {this.preferredTitle}</span>
              </div>

              <div className="col-md-1">
                <span className="label label-primary">{this.score}</span>
              </div>

              <div className="col-md-12">
                <div className="highlight-text">
                  

                  <cite>
                    <span>...</span>
                    <span dangerouslySetInnerHTML={{__html: this.display}}></span>
                    <span>...</span>
                  </cite>

                </div>
              </div>
        
          </div>
      </div>

    )
  }

}


export default PersonDisplay
