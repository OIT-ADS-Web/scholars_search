import React, { Component } from 'react';

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
              <div className="col-md-12 col-sm-12">
                <strong><a href={this.URI}>{this.name}</a></strong>
              </div>
            </div>
            <div className="row highlight-text">
              <div className="col-md-12">
               {this.highlightText(this.display)}
              </div>
            </div>

            {this.solrDocDisplay}
            
        </div>
    );
  }

}


export default GenericDisplay
