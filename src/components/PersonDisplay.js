import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

// needed for thumbnail stuff, I guess
require('../styles/scholars_search.less');

class PersonDisplay extends Component {

  constructor(props) {
    super(props);
    this.doc = this.props.doc;
    this.display = this.props.display;
  }

  f(str) {
    return (str || "").replace(/&#039;/g,"'");
  }

  get name() {
    return this.doc.nameRaw[0]
  }

  get preferredTitle() {
    return this.doc.PREFERRED_TITLE
  }

  get docId() {
    return this.doc.DocId
  }

  get allText() {
    return this.doc.ALLTEXT.join(" ")
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
              
              <div className="col-md-1">
                {picture}
              </div>
            
              <div className="col-md-11">
                <strong>{this.name}</strong>
                <span> - {this.preferredTitle}</span>
              </div>

              <div className="col-md-12">
                <div className="highlight-text">
                  <span>...</span>
                  <span dangerouslySetInnerHTML={{__html: this.display}}></span>
                  <span>...</span>
                </div>
              </div>
        
          </div>
      </div>

    )
  }

}


export default PersonDisplay
