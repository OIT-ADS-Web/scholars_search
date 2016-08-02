import React, { Component } from 'react';

//import PublicationDisplay from './PublicationDisplay'

import IsAbstractTab from './IsAbstractTab'

import HasSolrData from './HasSolrData'
import ScholarsLink from './ScholarsLink'

class PublicationDisplay extends HasSolrData(Component) {

  constructor(props) {
    super(props);
    this.doc = this.props.doc;
    this.highlight = this.props.highlight
  }

  f(str) {
    return (str || "").replace(/&#039;/g,"'");
  }


  render() {
    
    return (
         <div key="{this.docId}" className="publication search-result-row">
            <div className="row">
             <div className="col-md-12 col-sm-12"> 
              <strong>
                <ScholarsLink uri={this.URI} text={this.name} />
              </strong>
             </div>
 
            </div>
            
            <div className="row highlight-text">
              <div className="col-md-12">
                 {this.highlightDisplay}
              </div>
            </div>
            
            {this.solrDocDisplay}
 
         </div>
    )
  }

}


class PublicationsTab extends IsAbstractTab(Component)  {

  constructor(props) {
    super(props)
  }

  pickDisplay(doc, highlight) {
    return <PublicationDisplay key={doc.DocId} doc={doc} highlight={highlight}/> 
  }

}

export default PublicationsTab 

