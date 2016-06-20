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

    return (
         <div className="person search-result-row" key="{this.docId}">
            <div className="row">
              
              <div className="col-lg-1 col-md-12 col-xs-12 col-sm-12">
                {picture}
              </div>
            
              <div className="col-lg-11 col-md-12 col-xs-12 col-sm-12">
                <strong><a href={this.URI}>{this.name}</a></strong>
                <span> - {this.preferredTitle}</span>
              </div>

              <div className="col-lg-1 hidden-md hidden-sm hidden-xs">
                <span className="label label-primary">{this.score}</span>
              </div>

              <div className="col-lg-11 col-md-12 col-xs-12">
                <div className="highlight-text">
                  {this.highlightText(this.display)}
                </div>
              </div>
        
          </div>
      </div>

    )
  }

}


export default PersonDisplay
