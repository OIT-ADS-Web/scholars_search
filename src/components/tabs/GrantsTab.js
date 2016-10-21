import React, { Component } from 'react';

import HasSolrData from '../HasSolrData'
import ScholarsLink from '../ScholarsLink'

class GrantDisplay extends HasSolrData(Component) {

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

class GrantsFacets extends HasFacets(Component) {

  constructor(props) {
    super(props)
    
    this.onFacetClick = props.onFacetClick
    this.facets = props.facets

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

class GrantsFilterer extends TabFilterer {

  constructor(config) {
    super(config)
    this.facets = [{field: "mostSpecificTypeURIs", prefix: "type", options: {mincount: "1"}}]
  }

}


class GrantsTabDisplayer extends TabDisplayer {

  constructor() {
    super()
    this.facets = [{field: "mostSpecificTypeURIs", prefix: "type", label: "Type"}]
  }

  individualDisplay(doc, highlight) {
    return <GrantDisplay key={doc.DocId} doc={doc} highlight={highlight}/> 
  }

  facetDisplay(facet_counts, chosen_ids, callback, data) {
    let facet_fields = facet_counts.facet_fields
    return (<GrantsFacets facets={this.facets} facet_fields={facet_fields} chosen_facets={chosen_ids} onFacetClick={callback} context={data}/>)
  }
   

}

class GrantsTab extends Tab  {

  constructor() {
    super()

    this.id = "grants"
    this.label = "Grants"
    this.filter = "{!tag=grants}type:(*Grant)" 
 
    this.displayer = new GrantsTabDisplayer()
    
    this.filterer = new GrantsFilterer(this.filter)
  }


}


export default GrantsTab 

