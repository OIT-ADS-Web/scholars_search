import React, { Component } from 'react';


import FacetItem from './FacetItem'

class FacetList extends Component {

  constructor(props) {
    super(props)
    this.label = this.props.label
  }

  render() {
    let label = this.label

    return  (

     <aside>
       <ul className="list-group">
         <h4 className="list-group-item-heading">{label}</h4>
         {this.props.children}
       </ul>
     </aside>

    )
  }
}

export default FacetList

