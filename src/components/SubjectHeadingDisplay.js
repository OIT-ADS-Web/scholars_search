import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import HasSolrData from './HasSolrData'

class SubjectHeadingDisplay extends HasSolrData(Component) {

  constructor(props) {
    super(props);
    this.doc = this.props.doc;
    this.display = this.props.display;
  }

  render() {

    return (
         <div className="generic search-result-row" key="{this.docId}">
            <div className="row">
              <div className="col-md-11"> 
                <strong><a href={this.URI}>{this.name}</a></strong>
              </div>
              <div className="col-md-1">
                <span className="label label-primary">{this.score}</span>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <span> {this.URI}</span>
              </div>
            </div>

            <div className="row highlight-text">
              <div className="col-md-12">
                <cite>
                  <span>...</span>
                  <span dangerouslySetInnerHTML={{__html: this.display}}></span>
                  <span>...</span>
                </cite>
              </div>
            </div>
        </div>
    );
  }

}


export default SubjectHeadingDisplay
