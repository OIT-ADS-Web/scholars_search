import React, { Component } from 'react';

import HasSolrData from '../HasSolrData'
import ScholarsLink from '../ScholarsLink'

class PublicationDisplay extends HasSolrData(Component) {

  constructor(props) {
    super(props);
    this.doc = this.props.doc;
    this.highlight = this.props.highlight
  }

  get abstract() {
    let text = this.doc.abstract_text ? this.doc.abstract_text : ''
    return text
  }


  get authorList() {
    let text = this.doc.authorList_text ? this.doc.authorList_text : ''
    return text
  }

  
  render() {
    
    return (
         <div key="{this.docId}" className="publication search-result-row">
            <div className="row">
             
             <div className="col-md-12 col-sm-12"> 
              <strong>
                <ScholarsLink uri={this.URI} text={this.name} />
              </strong>
             </div>
           </div>
           <div className="row">
             <div className="col-md-12 col-sml-12">
                <span><i>{this.typeDisplay}</i></span>
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

import Facets from '../Facets'
import HasFacets from '../HasFacets'

class PublicationsFacets extends HasFacets(Component) {

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

class PublicationsFilterer extends TabFilterer {

  constructor(config) {
    super(config)
    this.facets = [{field: "mostSpecificTypeURIs", prefix: "type", options: {mincount: "1"}}]
  }

}


class PublicationsTabDisplayer extends TabDisplayer {

  individualDisplay(doc, highlight) {
    return <PublicationDisplay key={doc.DocId} doc={doc} highlight={highlight}/> 
  }

  facetDisplay(facet_counts, chosen_ids, callback, data) {
    let facet_fields = facet_counts.facet_fields
    return (<PublicationsFacets facet_fields={facet_fields} chosen_facets={chosen_ids} onFacetClick={callback} context={data}/>)
  }
 
}

class PublicationsTab extends Tab  {

  constructor() {
    super()

    this.id = "publications"
    this.filter = "{!tag=publications}type:(*bibo/Document)"
    this.label = "Publications"
 
    this.displayer = new PublicationsTabDisplayer()
  
    this.filterer = new PublicationsFilterer(this.filter)

  }


}

export default PublicationsTab 

