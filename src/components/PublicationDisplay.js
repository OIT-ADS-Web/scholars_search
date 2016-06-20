import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import HasSolrData from './HasSolrData'

class PublicationDisplay extends HasSolrData(Component) {

  constructor(props) {
    super(props);
    this.doc = this.props.doc;
    this.display = this.props.display;
  }

  f(str) {
    return (str || "").replace(/&#039;/g,"'");
  }


  render() {
    
    return (
         <div key="{this.docId}" className="publication search-result-row">
            <div className="row">
             <div className="col-md-11"> 
              <strong>
                 <a href={this.URI}>
                   <span dangerouslySetInnerHTML={{__html: this.name}}></span>
                 </a>
              </strong>
             </div>
             <div className="col-md-1">
                <span className="label label-primary">{this.score}</span>
              </div>
 
            </div>
            
            <div className="row highlight-text">
              <div className="col-md-12">
                 {this.highlightText(this.display)}
              </div>
            </div>

            <div className="row">
              <div className="col-md-2"><strong>Most Specific Type:</strong></div>
              <div className="col-md-10">{this.mostSpecificType}</div>
            </div> 

         </div>
    )
  }

}


export default PublicationDisplay
