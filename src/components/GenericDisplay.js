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
            <div className="row">
              <div className="col-md-12">
                <strong><a href={this.URI}>{this.name}</a></strong>
              </div>
            </div>
            <div className="row">
              <div className="col-md-2"><strong>Most Specific Type</strong></div> 
              <div className="col-md-9">{this.mostSpecificType}</div>
              <div className="col-md-1">
                <span className="label label-info">{this.score}</span>
              </div>
            </div>
            <div className="row highlight-text">
              <div className="col-md-12">
                <span>...</span>
                <span dangerouslySetInnerHTML={{__html: this.display}}></span>
                <span>...</span>
              </div>
            </div>
            <div className="row">
              <div className="col-md-1">
               <strong>Type(s)</strong>
              </div>
              <div className="col-md-11">
                <span dangerouslySetInnerHTML={{__html: this.types}}></span>
              </div>

            </div>
        </div>
    );
  }

}


export default GenericDisplay
