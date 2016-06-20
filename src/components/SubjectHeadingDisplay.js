import React, { Component } from 'react';

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
              <div className="col-md-11 col-xs-12 col-sm-12"> 
                <strong><a href={this.URI}>{this.name}</a></strong>
              </div>
              <div className="col-md-1 hidden-xs hidden-sm">
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
                 {this.highlightText(this.display)}
              </div>
            </div>

        </div>
    )
  }

}


export default SubjectHeadingDisplay
