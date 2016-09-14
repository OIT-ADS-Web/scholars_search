import React, { Component } from 'react';

class Facets extends Component {

  static get contextTypes() {
    return({
      router: PropTypes.object
    })
  }

  constructor(props) {
    super(props)
  }

  // render() {
  //
  //  if filter == 'people' --> ????
  //
  // }

}


import { connect } from 'react-redux'


const mapStateToProps = (search) => {
  return search
}


export default connect(mapStateToProps)(Facets)

/*
 *
 *  addFacet(field, options, localParam, prefix) {
 *
 *  next(1|*invidual{id}) --
 *   
 *   let uri_to_search = yield(
 *  }
 *
    searcher.setFacetField("department_facet_string", {prefix: "1|",  mincount: "1"})
    searcher.setFacetLocalParam("department_facet_string", "{!ex=dept}")
 
     let dept_filters = _.filter(this.filters, function(id) {
       return id.startsWith("dept_") 
    })   

    let dept_list = _.map(dept_filters, function(id) {
      let uri_to_search = `(1|*individual/${id})`.replace("dept_", "")  // FIXME: this must be wrong
      
      if (id == "dept_null") { 
        return `(-department_facet_string:[* TO *] AND *:*)`
      } else {
        return `department_facet_string:${uri_to_search}`
      }
    })

    // 2. gather those into a big OR query
    if(dept_list.length > 0) {
       let or_collection = dept_list.join(' OR ')
       let qry = `{!tag=dept}${or_collection}`
       //let qry = `${or_collection}`
       searcher.addFilter("dept", qry)
     }

    searcher.setFacetField("mostSpecificTypeURIs", {mincount: "1"})
    searcher.setFacetLocalParam("mostSpecificTypeURIs", "{!ex=type}")

    
    // 2. type facet
    let type_filters = _.filter(this.filters, function(id) {
      return id.startsWith("type_") 
    })   

    let type_list = _.map(type_filters, function(id) {
      let uri_to_search = `(*core#${id})`.replace("type_", "")  // FIXME: this must be wrong
      
      if (id == "type_null") { 
        return `(-mostSpecificTypeURIs:[* TO *] AND *:*)`
      } else {
        return `mostSpecificTypeURIs:${uri_to_search}`
      }
    })

    // 2. gather those into a big OR query
    if(type_list.length > 0) {
       let or_collection = type_list.join(' OR ')
       let qry = `{!tag=type}${or_collection}`
       //let qry = `${or_collection}`
       searcher.addFilter("type", qry)
     }
    

*/

