import React, { Component } from 'react';

import HasSolrData from '../HasSolrData'
import ScholarsLink from '../ScholarsLink'

// NOTE: go to bottom of file for actual Tab definition
//
class ArtisticWorkDisplay extends HasSolrData(Component) {

  constructor(props) {
    super(props)
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
              <div className="col-md-12 col-sm-12">
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


import Facets from '../Facets'
import HasFacets from '../HasFacets'

class ArtisticWorksFacets extends HasFacets(Component) {

  constructor(props) {
    super(props)
    
    this.onFacetClick = props.onFacetClick
    this.facets = [{field: "mostSpecificTypeURIs", prefix: "type", label: "Type"}]

  }

  render() {
    const { facet_fields, chosen_facets, context } = this.props
 
    let facetDisplay = this.facetFieldsDisplay(facet_fields, chosen_facets, context)
    //
    return (
      <Facets>
        {facetDisplay}
      </Facets>
     )

  }

 }


import Tab from '../Tab'

import { TabDisplayer, TabFilterer } from '../Tab'

class ArtisticWorksFilterer extends TabFilterer {

  constructor(config) {
    super(config)
    this.facets = [{field: "mostSpecificTypeURIs", prefix: "type", options: {mincount: "1"}}]
  }

}


class ArtisticWorksTabDisplayer extends TabDisplayer {

  individualDisplay(doc, highlight) {
    return <ArtisticWorkDisplay key={doc.DocId} doc={doc} highlight={highlight}/> 
  }

  facetDisplay(facet_counts, chosen_ids, callback, data) {
    let facet_fields = facet_counts.facet_fields
    return (<ArtisticWorksFacets facet_fields={facet_fields} chosen_facets={chosen_ids} onFacetClick={callback} context={data}/>)
  }
 
}

class ArtisticWorksTab extends Tab  {

  constructor() {
    super()
    
    this.id = "artisticworks"
    this.label = "Artistic Works"
    this.filter = "{!tag=artisticworks}type:(*ArtisticWork)"
       
    this.displayer = new ArtisticWorksTabDisplayer()
 
    this.filterer = new ArtisticWorksFilterer(this.filter)

  }

}

export default ArtisticWorksTab 

