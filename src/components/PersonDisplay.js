import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class PersonDisplay extends Component {

  constructor(props) {
    super(props);
    this.doc = this.props.doc;
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
      <li key="{this.doc.DocId}">
         <div>
            <strong>{this.name}</strong>
            <span> - {this.doc.PREFERRED_TITLE}</span>
         </div>
      </li>
    );
  }

}


export default PersonDisplay
