import React, { Component } from 'react';

import AbstractTab from './AbstractTab'

import HasSolrData from './HasSolrData'
import ScholarsLink from './ScholarsLink'

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
    );
  }

}


class GrantsTab extends AbstractTab(Component)  {

  constructor(props) {
    super(props)
  }

  pickDisplay(doc, highlight) {
    return <GrantDisplay key={doc.DocId} doc={doc} highlight={highlight}/> 
  }

}

export default GrantsTab 

