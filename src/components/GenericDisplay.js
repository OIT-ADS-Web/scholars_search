import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';


// FIXME: some of these methods are common to all  - so make 
// PersonDisplay extend GenericDisplay instead? extending
// object is too Java-ish though
//
class GenericDisplay extends Component {

  constructor(props) {
    super(props);
    this.doc = this.props.doc;
    this.display = this.props.display;
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
