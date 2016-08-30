import React, { Component } from 'react';


import FacetItem from './FacetItem'

class FacetList extends Component {

  constructor(props) {
    super(props)
    this.label = this.props.label
 
    //let departmentFacets = (<FacetList label="Departments" onFacetClick={cb} chosen_ids={chosen_ids}>{department_list}</FacetList>)
 
  }

  render() {
    let label = this.label
   
    //console.log(this.props.rows)
 
    //let facetItems = this.props.rows.map(function(row) {
    //  return (<FacetItem {...row } />)
    //})

    //console.log(facetItems)

    return  (
      <ul className="list-group">
        <h4 className="list-group-item-heading">{label}</h4>
        {this.props.children}
        {/*facetItems */}
      </ul>
    )
  }
}

export default FacetList

/*
 *
 *   render() {
    console.log("FacetItem#render()")
    
    console.log(this.facetLabel)
    //console.log(this.chosen_ids)

    //console.log(this.count)
    //console.log(this.assigned_id)

    let assigned_id = this.assigned_id
    let count = this.count
    let chosen_ids = this.chosen_ids
 
    let facetLabel = this.facetLabel
    let title = this.title
 
    if (chosen_ids.indexOf(assigned_id) > -1) {
 
      console.log("FacetItem#render() -- active ")
      console.log(chosen_ids.indexOf(assigned_id))

      return (
          <li className="list-group-item facet-item active">
            <span title={title} className="badge">{count}</span>
            <label htmlFor={assigned_id}>
              <input id={assigned_id} onClick={(e) => this.onFacetClick(e)} ref={assigned_id} type="checkbox" defaultChecked={true} />
              <span className="facet-label">{facetLabel}</span>
            </label>
          </li>
          )
        
    } else {
 
      console.log("FacetItem#render() -- NOT active ")
      console.log(chosen_ids.indexOf(assigned_id))

      return (
        <li className="list-group-item facet-item">
          <span title={title} className="badge">{count}</span> 
          <label htmlFor={assigned_id}>
            <input id={assigned_id} onClick={(e) => this.onFacetClick(e)} ref={assigned_id} type="checkbox" />
            <span className="facet-label">{facetLabel}</span>
          </label>
        </li>
        )
       
      }
    
  }

*/

