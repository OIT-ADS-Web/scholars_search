import React, { Component } from 'react';

import HasSolrData from '../HasSolrData'
import ScholarsLink from '../ScholarsLink'

class OrganizationDisplay extends HasSolrData(Component) {

  constructor(props) {
    super(props);
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
            <div className="row">
              <div className="col-md-12 col-sml-12">
                 {this.typeDisplay}
              </div>

            </div>
            
            {this.solrDocDisplay}
 
        </div>
    );
  }

}


import Facets from '../Facets'
import HasFacets from '../HasFacets'

class OrganizationsFacets extends HasFacets(Component) {

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

class OrganizationsTabDisplayer extends TabDisplayer {

  constructor() {
    super()

    this.facets = [{field: "mostSpecificTypeURIs", prefix: "type", label: "Type"}]
 
    // FIXME: make set facets() function? or put it in the constructor?
    // it would be *mostly* the same as filterer - but don't need options: {} 
    // but *do* need a "label" 
    // and possibly a *mapURItoName* function ???
    //  
    // this.facets = [{field: "mostSpecificTypeURIs", prefix: "type", label: "Type", ??fn: mapURItoName??, options: {mincount: "1"}}]
 
  }

  individualDisplay(doc, highlight) {
    return <OrganizationDisplay key={doc.DocId} doc={doc} highlight={highlight}/> 
  }
  
  // NOTE: this relates to just displaying facets on side
  //
  // TODO: rename facetDisplay()
  //
  // FIXME: don't like the data thing - is really a hash of {URI: <value>} for labeling purposes
  // 

  facetDisplay(facet_counts, chosen_ids, callback, data) {
    let facet_fields = facet_counts.facet_fields
    return (<OrganizationsFacets facets={this.facets} facet_fields={facet_fields} chosen_facets={chosen_ids} onFacetClick={callback} context={data}/>)
  }
   

}

class OrganizationsFilterer extends TabFilterer {

  constructor(config) {
    super(config)
    this.facets = [{field: "mostSpecificTypeURIs", prefix: "type", options: {mincount: "1"}}]
  }


}


class OrganizationsTab extends Tab  {

  constructor() {
    super()

    this.id = "organizations"
    this.filter = "{!tag=organizations}type:(*Organization)"
    this.label = "Organizations" 
 
    // is there a way to define facets here - almost declarative? e.g.
    // const facets = [{field: "mostSpecificTypeURIs", prefix: "type", options={mincount: "1"}, label: "Type"}
    //
    // could work for facet.fields at least
    
    this.displayer = new OrganizationsTabDisplayer()
    // this.displayer.facets = facets
    
    this.filterer = new OrganizationsFilterer(this.filter)
    // this.filterer.facets = facets
  
  }


}


export default OrganizationsTab 

