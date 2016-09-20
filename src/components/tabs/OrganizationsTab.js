import React, { Component } from 'react';

import HasSolrData from '../HasSolrData'
import ScholarsLink from '../ScholarsLink'

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

    // let typeLinks = this.typeLinks
    
    return (
         <div key="{this.docId}" className="organization search-result-row">
            
            <div className="row"> 
              <div className="col-md-9 col-sml-9"> 
                 <strong>
                  <ScholarsLink uri={this.URI} text={this.name} />
                </strong>
              </div>
              <div className="col-md-3 col-sml-3">
                 {this.typeDisplay}
              </div>

            </div>
            
            {this.solrDocDisplay}
 
        </div>
    );
  }

}



import Tab from '../Tab'

import { TabDisplayer } from '../Tab'

class OrganizationsTabDisplayer extends TabDisplayer {

  pickDisplay(doc, highlight) {
    return <OrganizationDisplay key={doc.DocId} doc={doc} highlight={highlight}/> 
  }

}

class OrganizationsTab extends Tab  {

  constructor() {
    super()

    this.id = "organizations"
    this.filter = "{!tag=organizations}type:(*Organization)"
    this.label = "Organizations" 
 
    this.displayer = new OrganizationsTabDisplayer()
  }


}


export default OrganizationsTab 

