import React, { Component } from 'react';

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


  // Continuant Document Entity Generically Dependent Continuant Information Content Entity
  filterHighlightText(text) {
    let replaced = text.replace("Continuant Document Entity Generically Dependent Continuant Information Content Entity", "")
    return replaced
  }
  
  render() {
    
    return (
         <div key="{this.docId}" className="publication search-result-row">
            <div className="row">
             <div className="col-md-11 col-sm-11"> 
              <strong>
                <ScholarsLink uri={this.URI} text={this.name} />
              </strong>
             </div>
             <div className="col-md-1 col-sm-1">
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

import Tab from './Tab'

class PublicationsTab extends Tab  {

  // render() ???
  //
  pickDisplay(doc, highlight) {
    return <PublicationDisplay key={doc.DocId} doc={doc} highlight={highlight}/> 
  }

}

export default PublicationsTab 

