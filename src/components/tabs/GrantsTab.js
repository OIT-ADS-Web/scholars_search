import React, { Component } from 'react';

import HasSolrData from '../HasSolrData'
import ScholarsLink from '../ScholarsLink'

class GrantDisplay extends HasSolrData(Component) {

  constructor(props) {
    super(props);
    this.doc = this.props.doc;
    this.highlight = this.props.highlight
  }

  filterHighlightText(text) {
    // Continuant Entity Grant Relationship Research Grant Specifically Dependent Continuant
    let replaced = text.replace("Continuant Entity Grant Institutional Training Grant Relationship Specifically Dependent Continuant", "")
    // another variation
    replaced = replaced.replace("Continuant Entity Grant Relationship Research Grant Specifically Dependent Continuant", "")
    return replaced
  }

  render() {

    return (
         <div className="generic search-result-row" key="{this.docId}">
            <div className="row">
              <div className="col-md-9 col-sm-9"> 
                 <strong>
                  <ScholarsLink uri={this.URI} text={this.name} />
                </strong>
              </div>
              <div className="col-md-3 col-sm-3">
                {this.typeDisplay}
              </div>

            </div>

            <div className="row highlight-text">
              <div className="col-md-12">
                 {this.highlightDisplay}
              </div>
            </div>

            {this.solrDocDisplay}
 
        </div>
    );
  }

}


import Tab from '../Tab'

import { TabDisplayer } from '../Tab'

class GrantsTabDisplayer extends TabDisplayer {

  individualDisplay(doc, highlight) {
    return <GrantDisplay key={doc.DocId} doc={doc} highlight={highlight}/> 
  }

}

class GrantsTab extends Tab  {

  constructor() {
    super()

    this.id = "grants"
    this.label = "Grants"
    this.filter = "{!tag=grants}type:(*Grant)" 
 
    this.displayer = new GrantsTabDisplayer()
  }


}


export default GrantsTab 

