import React, { Component } from 'react';

import HasSolrData from './HasSolrData'
import ScholarsLink from './ScholarsLink'

class ArtisticWorkDisplay extends HasSolrData(Component) {

  constructor(props) {
    super(props)
    this.doc = this.props.doc
    this.highlight = this.props.highlight
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


import Tab from './Tab'

import { TabDisplayer } from './Tab'

class ArtisticWorksTabDisplayer extends TabDisplayer {

  pickDisplay(doc, highlight) {
    return <ArtisticWorksDisplay key={doc.DocId} doc={doc} highlight={highlight}/> 
  }

}

class ArtisticWorksTab extends Tab  {

  constructor(config) {
    super(config)
    this._displayer = new ArtisticWorksTabDisplayer()
  }

  get displayer() { return this._displayer } 

}

export default ArtisticWorksTab 

