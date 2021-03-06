import React, { Component } from 'react';

import HasSolrData from '../HasSolrData'
import ScholarsLink from '../ScholarsLink'

// NOTE: go to bottom of file for actual Tab definition
//
class PublicationDisplay extends HasSolrData(Component) {

  constructor(props) {
    super(props);
  }

  get abstract() {
    let text = this.doc.abstract_string ? this.doc.abstract_string : ''
    return text
  }


  get authorList() {
    let text = this.doc.authorList_string ? this.doc.authorList_string : ''
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
    this.facets = props.facets

  }

  render() {
    const { facet_fields, chosen_facets, extraData } = this.props
 
    let facetDisplay = this.facetFieldsDisplay(facet_fields, chosen_facets, extraData)
    //
    return (
      <Facets>
        {facetDisplay}
      </Facets>
     )

  }

 }


import Tab from '../Tab'
import { TabDisplayer, TabFilterer, TabDownloader } from '../Tab'

class PublicationsFilterer extends TabFilterer {

  constructor(config) {
    super(config)
    this.facets = [{field: "mostSpecificTypeURIs", prefix: "type", options: {mincount: "1"}}]
  }

}


class PublicationsTabDisplayer extends TabDisplayer {

  constructor() {
    super()
    this.facets = [{field: "mostSpecificTypeURIs", prefix: "type", label: "Type"}]
  }

  individualDisplay(doc, highlight) {
    return <PublicationDisplay key={doc.DocId} doc={doc} highlight={highlight}/> 
  }

  facetDisplay(facet_counts, chosen_ids, callback, data) {
    let facet_fields = facet_counts.facet_fields
    return (<PublicationsFacets facets={this.facets} facet_fields={facet_fields} chosen_facets={chosen_ids} onFacetClick={callback} extraData={data}/>)
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

     let fields = [{ label: 'authorList', value: 'authorList_text',  default: ''}, 
      { label: 'abstract', value: 'abstract_text', default: ''}
    ]
 
    this.downloader = new TabDownloader(fields)
    
  }


}

export default PublicationsTab 

