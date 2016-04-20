import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

// NOTE: props are sent to components
class OrganizationDisplay extends Component {

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

  render() {
    // FIXME: probably dont want to stick with this <tr> approach
    return (
         <tr key="{this.docId}" className="organization">
           <td></td>
           <td>   
              <strong>{this.name}</strong>
              <span> - {this.preferredTitle}</span>
              <div>
                <span>...</span>
                <span dangerouslySetInnerHTML={{__html: this.display}}></span>
                <span>...</span>
              </div>
            </td>
          </tr>
    );
  }

}


export default OrganizationDisplay
