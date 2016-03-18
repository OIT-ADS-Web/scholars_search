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
    return ""
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
      <div>
        <img typeof="Image"
             className="image-style-profile-search-main"
             src={this.pictureUri}
             width="100"
             height="100" />
        <a href={this.doc.url} key={this.doc.path}>
          {this.name}
        </a>
        {' '}
        <br />
        [{this.doc.path} / {this.doc.label} / {this.doc.ts_duke_sap_partner}]
      </div>
    );
  }

}


export default PersonDisplay
