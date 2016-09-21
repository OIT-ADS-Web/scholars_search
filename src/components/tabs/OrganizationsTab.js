import React, { Component } from 'react';

import HasSolrData from '../HasSolrData'
import ScholarsLink from '../ScholarsLink'

class OrganizationDisplay extends HasSolrData(Component) {

  constructor(props) {
    super(props);
    this.doc = this.props.doc;
    this.highlight = this.props.highlight
  }

  // Agent Continuant Department Entity Independent Continuant Organization
  filterHighlightText(text) {
    let replaced = text.replace("Agent Continuant Department Entity Independent Continuant Organization", "")
    return replaced
  }

  render() {

    return (
         <div key="{this.docId}" className="organization search-result-row">
            
            <div className="row"> 
              <div className="col-md-9 col-sml-9"> 
                 <strong>
                  <ScholarsLink uri={this.URI} text={this.name} />
                </strong>
              </div>
              <div className="col-md-3 col-sml-3">
                 {this.typeDisplay}
              </div>

            </div>
            
            {this.solrDocDisplay}
 
        </div>
    );
  }

}


import FacetList from '../FacetList'
import FacetItem from '../FacetItem'
import Facets from '../Facets'

// 
class OrganizationsFacets extends Component {

  constructor(props) {
    super(props)
    
    this.onFacetClick = props.onFacetClick
   }

  parseFacetFields(facet_fields) {
    // FIXME: this could be generalized in base Component of some sort
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

  facetFieldDisplay(facet_fields, chosen_facets, context) {
    
    let size = facet_fields.length

    if (!(facet_fields || size > 0)) {
      return ""
    }

    // FIXME: this could be generalized in base Component of some sort
    //
    // 1) first parse our search/facet_fields results
    let results = this.parseFacetFields(facet_fields)

    // NOTE: data is blank for a while, but it doesn't seem to make a difference unless I try to call <FacetItem />
    let items = results['mostSpecificTypeURIs']
 
    // FIXME: seems like this should work, but it does not
    let display_list  = _.map(items, (item) => {
       
      let abb = item.label.split("#")[1] || item.label
 
      if (abb === item.label) {
        abb = item.label.substring(item.label.lastIndexOf("/") + 1)
      }
 
      let id = "type_" + abb
      let title = abb
      let label = abb
      
      let facetItem = (
          <FacetItem key={id} assigned_id={id} count={item.count} chosen_ids={chosen_facets} onFacetClick={this.onFacetClick} facetLabel={label} title={title} />
      )
      return facetItem
     
    })
    

    let facetList = (<FacetList label="Type">{display_list}</FacetList>)
 
    let facets = (
      <div className="facet-panel">
        <h4 className="heading">Filter By</h4>
        {facetList}
      </div>
    )

    return facets
  }

  render() {
    // FIXME: this could be generalized too - it's basically facetFieldDisplay that's unique, right?
    //
    const { facet_fields, chosen_facets, context } = this.props
 
    // this is just returning blank because it *may* (or may not) need the 'context' 
    // (I do in the people facets for instance) - so just copied from PeopleTab code for now
    //
    if (!context) {
      return ""
    }

    let facetFieldDisplay = this.facetFieldDisplay(facet_fields, chosen_facets, context)

    return (
      <Facets>
        {facetFieldDisplay }
      </Facets>
     )

  }

 }



import Tab from '../Tab'
import { TabDisplayer, TabFilterer } from '../Tab'

import { Faceter } from '../Tab'

class OrganizationsTabDisplayer extends TabDisplayer {

  pickDisplay(doc, highlight) {
    return <OrganizationDisplay key={doc.DocId} doc={doc} highlight={highlight}/> 
  }

  facets(facet_counts, chosen_ids, callback, data) {
    let facet_fields = facet_counts.facet_fields
    return (<OrganizationsFacets facet_fields={facet_fields} chosen_facets={chosen_ids} onFacetClick={callback} context={data}/>)
  }
  

}

class OrganizationsFilterer extends TabFilterer {

  constructor(config) {
    super(config)
    
    // this.facets = [{field: "mostSpecificTypeURIs", prefix: "type" }]
    // or even
    // this.facets = config.facets
    //
  }

  applyFilters(searcher) {
    super.applyFilters(searcher)
 
    // NOTE: this does OR with itself but multiple ones should
    // do AND between each other
    this.applyFacet(searcher, "mostSpecificTypeURIs", "type", {mincount: "1"})

    // _.forEach(this.facets, function(value, key) {
    //   this.applyFacet(searcher, facet.field, prefix)
    // })
    //
  }

  // NOTE: this is called by saga
  applyOptionalFilters(searcher) {

   // _.forEach(this.facets, function(value, key) {
   //   let faceter = new Facter(searcher, facet.field, this.facet_ids, facet.prefix)
   //   faceter.applyFacet()
   // })
   //
   let faceter = new Faceter(searcher, "mostSpecificTypeURIs", this.facet_ids, "type")
   faceter.applyFacet()

  }


}


class OrganizationsTab extends Tab  {

  constructor() {
    super()

    console.log("OrganizationsTab#constructor")

    this.id = "organizations"
    this.filter = "{!tag=organizations}type:(*Organization)"
    this.label = "Organizations" 
 
    // is there a way to define facets here - almost declarative? e.g.
    // const facets = [{type: "mostSpecificType"}]
    //
    // could work for facet.fields at least
    
    this.displayer = new OrganizationsTabDisplayer()
    // this.displayer.facets = facets
    
    this.filterer = new OrganizationsFilterer(this.filter)
    // this.filterer.facets(facets)
  
  }


}


export default OrganizationsTab 

