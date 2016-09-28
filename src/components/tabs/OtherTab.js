import React, { Component } from 'react'

import GenericTab from './GenericTab'

import Facets from '../Facets'
import HasFacets from '../HasFacets'


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

import { TabFilterer, TabDisplayer } from '../Tab'

import { GenericTabDisplayer, GenericDisplay } from './GenericTab'

// got "Super expression must either be null or a function, not undefined"
// when trying to use this:
//
//class OtherTabDisplayer extends GenericTabDisplayer {
class OtherTabDisplayer extends TabDisplayer {

  individualDisplay(doc, highlight) {
    //return super.individualDisplay(doc, highlight)
    return <GenericDisplay key={doc.DocId} doc={doc} highlight={highlight}/> 
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


class OtherTab extends GenericTab {

  constructor() {

    super()

    this.id =  "misc"
    this.filter =  "{!tag=misc}type:((*Award) OR (*Presentation) OR (*geographical_region) OR (*self_governing))"
    //this.filter = "{!tag=misc}type:(NOT((*Person) OR (*bibo/Document) OR (*Organization) OR (*Grant) OR (*Course) OR (*ArtisticWork) OR (*Concept)))"
 
    this.label =  "Other"

    this.displayer = new OtherTabDisplayer()

    this.filterer = new OtherFilterer(this.filter)

  }
 
}


export default OtherTab 
