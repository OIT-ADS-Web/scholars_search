import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class PublicationDisplay extends Component {

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

  render() {
    
    return (
         <div key="{this.docId}" className="publication search-result-row">
            <div className="row">
             <div className="col-md-12"> 
              <strong>
                 <span dangerouslySetInnerHTML={{__html: this.name}}></span>
              </strong>
             </div>
            </div>
            
            <div className="row highlight-text">
              <div className="col-md-12">
                <span>...</span>
                <span dangerouslySetInnerHTML={{__html: this.display}}></span>
                <span>...</span>
              </div>
            </div>
         
         </div>
    )
  }

}


export default PublicationDisplay
