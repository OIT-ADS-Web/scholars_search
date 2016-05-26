import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import HasSolrData from './HasSolrData'

class OrganizationDisplay extends HasSolrData(Component) {

  constructor(props) {
    super(props);
    this.doc = this.props.doc;
    this.display = this.props.display;
  }

  render() {
    return (
         <div key="{this.docId}" className="organization search-result-row">
            
            <div className="row"> 
              <div className="col-md-11"> 
                <strong>{this.name}</strong>
              </div>
              <div className="col-md-1">
                <span className="label label-primary">{this.score}</span>
              </div>
 
            </div>
            
            <div className="row">
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


export default OrganizationDisplay
