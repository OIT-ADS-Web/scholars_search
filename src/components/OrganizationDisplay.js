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
              <div className="col-md-12 col-sml-12"> 
                <strong><a href={this.URI}>{this.name}</a></strong>
              </div>
            </div>
            
            {this.solrDocDisplay}
 
        </div>
    );
  }

}


export default OrganizationDisplay
