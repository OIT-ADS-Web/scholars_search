import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

// Person = struct of some sort???
// 
//
// NOTE: props are sent to components
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

    //return ""
    //if (this.doc.ts_duke_header_hero_name) {
    //  return this.f(this.doc.ts_duke_header_hero_name);
    //}
    //return this.f(this.doc.ts_duke_goes_by_name);
    // return this.f(`${this.doc.ts_duke_header_hero_name} // ${this.doc.ts_duke_goes_by_name}`);
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
      picture = <img src={this.thumbnailUrl} height="125"></img>
    } else {
      picture = <span></span>
    }

    // FIXME: there are some pitfalls to having disembodied <tr> tables built up
    return (
         <div className="person search-result-row" key="{this.docId}">
           <div>{picture}</div>
           
           <div>
            <strong>{this.name}</strong>
            <span> - {this.preferredTitle}</span>
            <div className="highlight-text">
              <span>...</span>
              <span dangerouslySetInnerHTML={{__html: this.display}}></span>
              <span>...</span>
            </div>
           </div>
        
        </div>
    );
  }

}


export default PersonDisplay
