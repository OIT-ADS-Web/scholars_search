import React from 'react'

import FacetList from './FacetList'
import FacetItem from './FacetItem'
import Facets from './Facets'

let HasFacets = (superclass) => class extends superclass {

  // NOTE: this is only used in PeopleTab, maybe it should not be
  // in this class
  mapURIsToName(data) {
    let hash = {}
    _.forEach(data, function(obj) {
       hash[obj.URI] = obj.name
    })
    return hash
  }

  
  parseFacetFields(facet_fields) {
    //
    // 1) first parse our search/facet_fields results
    let results = {}
    _.forEach(facet_fields, function(value, key) {
      results[key] = []
      
      let array = value

      let size = array.length
      let i = 0
      // strangely results are array, of [<count><field>, <count><field> ... ]
      while (i < size) {
        let label = array[i]
        let count = array[i+1]
        let summary = {label: label, count:count}
        results[key].push(summary)

        i = i + 2
      }
    })

    return results
  }

  // gets the label for a facet as it's looping through (see #facetItems) 
  // NOTE: this is what you'd override if you need to control the label better
  facetItem(prefix, item, context={}) {
      let abb = item.label.split("#")[1] || item.label
      if (abb == item.label) {
        abb = item.label.substring(item.label.lastIndexOf("/") + 1)
      }
  
      let id = `${prefix}_${abb}`
      let title = abb
      let label = abb.replace(/([A-Z])/g, ' $1') // NOTE: changes "AcademicDepartment" to "Academic Department"
      let value = item.label

      return { id: id, title: title, label: label, value: value }
  }

  facetItems(facet_fields, field, prefix, chosen_facets, context={}) {
    let results = this.parseFacetFields(facet_fields)
 
    let items = results[field]

    let list = _.map(items, (item) => {
      let {id, title, label, value } = this.facetItem(prefix, item, context)
      let facetItem = (
           <FacetItem key={id} assigned_id={id} count={item.count} chosen_ids={chosen_facets} onFacetClick={this.onFacetClick} facetLabel={label} title={title} value={value}/>
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
 
  /* FIXME: could, in theory, give this mixin a render() method too (see below)
   *
   * I wanted each Component extends HasFacets(Component) to define it's own render, so you'd 
   * always see what is rendered in the Component code - rather than going to the mixin code
   * 
   * downside: it leads to duplicated code (since the same code appears in every component)
   *
  render() {
    const { facet_fields, chosen_facets, context } = this.props
 
    // NOTE: this doesn't seem to do what I want it to (not show people/department
    // facets until we have departments loaded)
    //
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

