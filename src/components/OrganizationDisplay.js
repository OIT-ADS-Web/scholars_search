import React, { Component } from 'react';
import { connect } from 'react-redux';

import HasSolrData from './HasSolrData'
import ScholarsLink from './ScholarsLink'

class OrganizationDisplay extends HasSolrData(Component) {

  constructor(props) {
    super(props);
    this.doc = this.props.doc;
    this.highlight = this.props.highlight
  }

  render() {
    return (
         <div key="{this.docId}" className="organization search-result-row">
            
            <div className="row"> 
              <div className="col-md-12 col-sml-12"> 
                 <strong>
                  <ScholarsLink uri={this.URI} text={this.name} />
                </strong>
              </div>
            </div>
            
            {this.solrDocDisplay}
 
        </div>
    );
  }

}


export default OrganizationDisplay
