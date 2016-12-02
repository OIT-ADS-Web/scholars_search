import React, { Component } from 'react'

import Facets from '../Facets'
import HasFacets from '../HasFacets'
import HasSolrData from '../HasSolrData'

import ScholarsLink from '../ScholarsLink'

// NOTE: go to bottom of file for actual Tab definition
//
class OtherDisplay extends HasSolrData(Component) {

  constructor(props) {
    super(props)
  }

  render() {
    let geoMatch = /^http:\/\/aims.fao.org\/aos\/geopolitical.owl*/

    let uri = this.URI
    let isGeo= geoMatch.test(uri)

    if (isGeo) {
      uri = `https://scholars.duke.edu/individual?uri=${encodeURIComponent(this.URI)}`
    }

    return (
         <div className="generic search-result-row" key="{this.docId}">
            <div className="row">
              <div className="col-md-12 col-xs-12 col-sm-12"> 
                 <strong>
                  <ScholarsLink uri={uri} text={this.name} />
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
    )
  }

}


class OtherFacets extends HasFacets(Component) {

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

import { TabFilterer, TabDisplayer } from '../Tab'

class OtherTabDisplayer extends TabDisplayer {

  individualDisplay(doc, highlight) {
    return <OtherDisplay key={doc.DocId} doc={doc} highlight={highlight}/> 
  }

  
  facetDisplay(facet_counts, chosen_ids, callback, data) {
    let facet_fields = facet_counts.facet_fields
    return (<OtherFacets facet_fields={facet_fields} chosen_facets={chosen_ids} onFacetClick={callback} context={data}/>)
  }
   

}

class OtherFilterer extends TabFilterer {

  constructor(config) {
    super(config)
    this.facets = [{field: "mostSpecificTypeURIs", prefix: "type", options: {mincount: "1"}}]
  }

}


class OtherTab extends Tab {

  constructor() {
    super()

    this.id =  "misc"
    this.filter =  "{!tag=misc}type:((*Award) OR (*Presentation) OR (*ProfessionalActivity) OR (*geographical_region) OR (*self_governing))"
    // NOTE: the following gets *everything else* via NOT which is sometimes useful
    //
    //this.filter = "{!tag=misc}type:(NOT((*Person) OR (*bibo/Document) OR (*Organization) OR (*Grant) OR (*Course) OR (*ArtisticWork) OR (*Concept)))"
 
    this.label =  "Other"

    this.displayer = new OtherTabDisplayer()
    this.filterer = new OtherFilterer(this.filter)

  }
 
}


export default OtherTab 
