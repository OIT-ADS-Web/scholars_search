import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';


// FIXME: some of these methods are common to all  - so make 
// PersonDisplay extend GenericDisplay instead?
//
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

  // get Types() {
  // FIXME: types can look like this...
  // maybe we should list them?  Or have images to represent them,
  // or take the topmost? or ??? just mostSpecificType --
  //
  // "mostSpecificTypeURIs": [ "http://vivoweb.org/ontology/core#Program" ],
  /* 
   * "type": [
      "http://xmlns.com/foaf/0.1/Agent",
      "http://purl.obolibrary.org/obo/BFO_0000002",
      "http://purl.obolibrary.org/obo/BFO_0000001",
      "http://purl.obolibrary.org/obo/BFO_0000004",
      "http://xmlns.com/foaf/0.1/Organization",
      "http://vivoweb.org/ontology/core#Program"
    ],
  */
  //
  //}

  get preferredTitle() {
    return this.doc.PREFERRED_TITLE
  }

  get docId() {
    return this.doc.DocId
  }

  get allText() {
    return this.doc.ALLTEXT.join(" ")
  }

  get mostSpecificType() {
    return this.doc.mostSpecificTypeURIs.join(" ")
  }

  render() {

    return (
         <div className="generic search-result-row" key="{this.docId}">
            <strong>{this.name}</strong>
            <div className="row">
              <div className="col-md-1">Type</div> 
              <div className="col-md-11">{this.mostSpecificType}</div>
            </div>
            <div className="row highlight-text">
              <div className="col-md-12">
                <span>...</span>
                <span dangerouslySetInnerHTML={{__html: this.display}}></span>
                <span>...</span>
              </div>
            </div>
        </div>
    );
  }

}


export default GenericDisplay
