import React, { Component } from 'react';

import classNames from 'classnames'

class FacetCheckbox extends Component {

  constructor(props) {
    super(props)
 
    this.assigned_id = this.props.assigned_id
    this.onFacetClick = this.props.onFacetClick
    
    this.state = {
      is_checked: false
    }
  }

  render() {
    const { assigned_id, is_checked } = this.props
    
    let selected = is_checked
    //let selected = is_checked ? is_checked : (this.state.is_checked)

       return (
        <input id={assigned_id} checked={selected} onClick={(e) => this.onFacetClick(e)} ref={assigned_id} type="checkbox" />
    )
  }


}

class FacetItem extends Component {

  constructor(props) {
    super(props)
 
    this.onFacetClick = this.props.onFacetClick

  }

  render() {
    const { assigned_id, count, chosen_ids, facetLabel, title } = this.props
    
    let is_checked = false

    if (chosen_ids.indexOf(assigned_id) > -1) { is_checked = true }

    const listClasses = classNames({'list-group-item': true, 'facet-item': true, 'active': is_checked})     
   
    return (
        <li className={listClasses}>
          <span title={title} className="badge">{count}</span> 
          <label htmlFor={assigned_id}>
            <FacetCheckbox assigned_id={assigned_id} onFacetClick={this.onFacetClick} is_checked={is_checked}/>
            <span className="facet-label">{facetLabel}</span>
          </label>
        </li>
     )

  }


}

export default FacetItem

