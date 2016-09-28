import React, { Component } from 'react';

import classNames from 'classnames'

import _ from 'lodash'

class FacetCheckbox extends Component {

  constructor(props) {
    super(props)
 
    this.assigned_id = this.props.assigned_id
    this.onFacetClick = this.props.onFacetClick

    this.onClick = this.onClick.bind(this)
 
    this.state = {
      is_checked: false
    }
  }


  onClick(e, assigned_id, value) {
    
    e.preventDefault() 
    // FIXME: not crazy about this callback, calling callback
    // is this idiomatic React? - or is there a more straighforward way?
    
    let prefix = assigned_id.substr(0, assigned_id.indexOf("_"))
    let new_assigned_id = `${prefix}_${value}`

    this.setState({is_checked: !this.state.is_checked}, function() {
      this.onFacetClick(e, new_assigned_id, this.state.is_checked, value)
    })
  }

  render() {
    const { assigned_id, is_checked, value } = this.props
 
    let selected = is_checked

   return (
        <input id={assigned_id} checked={selected} onClick={(e) => this.onClick(e, assigned_id, value)} ref={assigned_id} type="checkbox" />
    )
  }


}

class FacetItem extends Component {

  constructor(props) {
    super(props)
 
    this.onFacetClick = this.props.onFacetClick

  }

  render() {
    const { assigned_id, count, chosen_ids, facetLabel, title, value } = this.props
    
    let is_checked = false

    let prefix = assigned_id.substr(0, assigned_id.indexOf("_"))
    let new_assigned_id = `${prefix}_${value}`

    if (chosen_ids.indexOf(new_assigned_id) > - 1) { is_checked = true }

    const listClasses = classNames({'list-group-item': true, 'facet-item': true, 'active': is_checked})     
   
    return (
        <li className={listClasses}>
          <span title={value} className="badge">{count}</span> 
          <label htmlFor={assigned_id}>
           <FacetCheckbox assigned_id={assigned_id} onFacetClick={this.onFacetClick} is_checked={is_checked} value={value}/>
            <span className="facet-label">{facetLabel}</span>
          </label>
        </li>
     )

  }


}

export default FacetItem

