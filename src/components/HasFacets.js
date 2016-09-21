import React from 'react'

import FacetList from './FacetList'
import FacetItem from './FacetItem'
import Facets from './Facets'

import { FacetHelper } from './Tab'

let HasFacets = (superclass) => class extends superclass {

  facetItems(facet_fields, field, prefix, chosen_facets, context={}) {
    let helper = new FacetHelper()
    let results = helper.parseFacetFields(facet_fields)
 
    let items = results[field]
 
    let list = _.map(items, (item) => {
      let abb = item.label.split("#")[1] || item.label
      if (abb == item.label) {
        abb = item.label.substring(item.label.lastIndexOf("/") + 1)
      }
  
      let id = `${prefix}_${abb}`
      let title = abb
      let label = abb
    
      let facetItem = (
           <FacetItem key={id} assigned_id={id} count={item.count} chosen_ids={chosen_facets} onFacetClick={this.onFacetClick} facetLabel={label} title={title} />
        )
      return facetItem
    })

    return list   
   }

   facetFieldsDisplay(facet_fields, chosen_facets, context) {

    let size = facet_fields.length

    if (!(facet_fields || size > 0)) {
      return ""
    }

    let facetLists = _.map(this.facets, (facet) => {
      let field = facet.field
      let prefix = facet.prefix
      let label = facet.label

      let items  = this.facetItems(facet_fields, field, prefix, chosen_facets, context)
      let list = (
          <FacetList key={field} label={label}>{items}</FacetList>
      )
      return list
    })
  
     let facetDisplay = (
      <div className="facet-panel">
        <h4 className="heading">Filter By</h4>
        {facetLists}
      </div>
    )
  
    return facetDisplay
  }
 
  /*
  render() {
    const { facet_fields, chosen_facets, context } = this.props
 
    if (!context) {
      return ""
    }

    let facetFieldDisplay = this.facetFieldsDisplay(facet_fields, chosen_facets, context)
    
    return (
      <Facets>
        {facetFieldDisplay }
      </Facets>
     )

  }
  */

  
}

export default HasFacets

