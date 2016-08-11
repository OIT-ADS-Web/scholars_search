import React, { Component } from 'react';

import HasSolrData from './HasSolrData'
import ScholarsLink from './ScholarsLink'

class OrganizationDisplay extends HasSolrData(Component) {

  constructor(props) {
    super(props);
    this.doc = this.props.doc;
    this.highlight = this.props.highlight
  }

  // Agent Continuant Department Entity Independent Continuant Organization
  filterHighlightText(text) {
    let replaced = text.replace("Agent Continuant Department Entity Independent Continuant Organization", "")
    return replaced
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



import Tab from './Tab'

class OrganizationsTab extends Tab  {

  pickDisplay(doc, highlight) {
    return <OrganizationDisplay key={doc.DocId} doc={doc} highlight={highlight}/> 
  }

}


export default OrganizationsTab 

