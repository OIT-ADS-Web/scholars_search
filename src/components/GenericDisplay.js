import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import HasSolrData from './HasSolrData'

class GenericDisplay extends HasSolrData(Component) {

  constructor(props) {
    super(props);
    this.doc = this.props.doc;
    this.display = this.props.display;
  }

  render() {

    return (
         <div className="generic search-result-row" key="{this.docId}">
            <strong>{this.name}</strong>
            <div className="row">
              <div className="col-md-1">Type</div> 
              <div className="col-md-10">{this.mostSpecificType}</div>
              <div className="col-md-1">
                <span className="label label-primary">{this.score}</span>
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
    );
  }

}


export default GenericDisplay
