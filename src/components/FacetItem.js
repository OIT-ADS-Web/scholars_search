import React, { Component } from 'react';

class FacetItem extends Component {

  constructor(props) {
    super(props)
 
    console.log("FacetItem#constructor")
    console.log(props)   
 
    // console.log(this.props)

    this.assigned_id = this.props.assigned_id
    this.count = this.props.count
    
    this.chosen_ids = this.props.chosen_ids
    this.onFacetClick = this.props.onFacetClick
 
    this.facetLabel = this.props.facetLabel   
    this.title = this.props.title
 
    //this.assigned_id = this.props.props.assigned_id
    //this.count = this.props.props.count
    //this.chosen_ids = this.props.props.chosen_ids
    //this.onFacetClick = this.props.props.onFacetClick
 
    //this.label = this.props.props.label   
    //this.title = this.props.props.title
  }

  render() {
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


}

export default FacetItem

