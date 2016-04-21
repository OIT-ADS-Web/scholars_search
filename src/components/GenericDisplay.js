import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class GenericDisplay extends Component {

  constructor(props) {
    super(props);
    this.doc = this.props.doc;
    this.display = this.props.display;
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


  render() {

    return (
         <div className="generic search-result-row" key="{this.docId}">
            <strong>{this.name}</strong>
            <span> - {this.preferredTitle}</span>
            <div>
              <span>...</span>
              <span dangerouslySetInnerHTML={{__html: this.display}}></span>
              <span>...</span>
            </div>
        </div>
    );
  }

}


export default GenericDisplay
