import React, { Component } from 'react';

import HasSolrData from '../HasSolrData'
import ScholarsLink from '../ScholarsLink'

class GenericDisplay extends HasSolrData(Component) {

  constructor(props) {
    super(props);
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

            <div className="row">
              <div className="col-md-12">
               {this.typeDisplay}
              </div>
            </div>

            {this.solrDocDisplay}
            
        </div>
    );
  }

}

export { GenericDisplay, GenericTabDisplayer }

import Tab from '../Tab'
import { TabDisplayer } from '../Tab'

class GenericTabDisplayer extends TabDisplayer {

  individualDisplay(doc, highlight) {
    return <GenericDisplay key={doc.DocId} doc={doc} highlight={highlight}/> 
  }

}

class GenericTab extends Tab  {

  constructor() {
    super()
     
    // NOTE: giving these properties just in case tabs are ill-defined and this
    // one ends up defaulting.  Should never actually use this as a tab though
    //
    this.id = "generic"
    this.label = "Generic"
    this.filter = "{!tag=things}type:(*Thing)" 
 
    this.displayer = new GenericTabDisplayer()
  }


}


export default GenericTab 
