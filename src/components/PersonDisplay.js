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

  get pictureUri() {
    let host = "https://scholars.duke.edu";
    //
    //if (this.doc.ts_picture_uri === undefined) {
    //  return `${host}/sites/all/modules/custom/solutionset/images/photo_placeholder_114x154.jpg`;
    //}
    //return host + this.doc.ts_picture_uri.replace(/public:\//,'/sites/default/files');
    return host
  }

  render() {

    return (
      <li key="{this.docId}">
         <div>
            <strong>{this.name}</strong>
            <span> - {this.preferredTitle}</span>
            <div style={{display:'none'}}>{this.allText}</div>
            <div dangerouslySetInnerHTML={{__html: this.display}}></div>
          </div>
      </li>
    );
  }

}


export default PersonDisplay
