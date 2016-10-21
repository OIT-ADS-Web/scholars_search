import React, { Component } from 'react';

import HasSolrData from '../HasSolrData'
import ScholarsLink from '../ScholarsLink'

class SubjectHeadingDisplay extends HasSolrData(Component) {

  constructor(props) {
    super(props);
  }

  render() {
    let meshMatch = /^https:\/\/scholars.duke.edu\/individual\/mesh*/
    let locMatch = /^http:\/\/id.loc.gov\/authorities\/subjects\/*/
    // NOTE: I believe this is probably the wrong way to generate a URI for Duke specific concepts
    // but that's what it is right now example:
    // https://scholars.duke.edu/individual/dukehttps://scholars.duke.edu/individual/scsG05
    //
    let dukeMatch = /^https:\/\/scholars.duke.edu\/individual\/dukehttps:\/\/scholars.duke.edu\/individual\/*/

    let uri = this.URI
    
    let isMesh = meshMatch.test(uri)
    let isLoc = locMatch.test(uri)
    let isDuke = dukeMatch.test(uri)

    let logo = function() {
      if (isMesh) {
        return require('../../images/meshhead.gif')
      } else if (isLoc) {
        return require('../../images/loc-logo.png')
      } else {
        return require('../../images/duke-text-logo.png')
      }
    }()

    if (isLoc || isDuke) {
      uri = `https://scholars.duke.edu/individual?uri=${encodeURIComponent(this.URI)}`
    }

    return (
         <div className="generic search-result-row" key="{this.docId}">
            <div className="row">
              <div className="col-md-12 col-xs-12 col-sm-12"> 
                 <strong>
                  <ScholarsLink uri={uri} text={this.name} />
                </strong>
              </div>
            </div>
            
            {this.solrDocDisplay}
 
        </div>
    )
  }

}


import Facets from '../Facets'
import HasFacets from '../HasFacets'

class SubjectHeadingsFacets extends HasFacets(Component) {

  constructor(props) {
    super(props)
    
    this.onFacetClick = props.onFacetClick
    this.facets = props.facets

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


import Tab from '../Tab'
import { TabDisplayer, TabDownloader, TabFilterer } from '../Tab'


class SubjectHeadingsFilterer extends TabFilterer {

  constructor(config) {
    super(config)
    this.facets = [{field: "subjectheading_facet_string", prefix: "source", options: {mincount: "1"}}]
  
  }

}



class SubjectHeadingsTabDisplayer extends TabDisplayer {

  constructor() {
     super()
     this.facets = [{field: "subjectheading_facet_string", prefix: "source", label: "Source"}]
   }
  

  individualDisplay(doc, highlight) {
    return <SubjectHeadingDisplay key={doc.DocId} doc={doc} highlight={highlight}/> 
  }

  
  facetDisplay(facet_counts, chosen_ids, callback, data) {
    let facet_fields = facet_counts.facet_fields
    return (<SubjectHeadingsFacets facets={this.facets} facet_fields={facet_fields} chosen_facets={chosen_ids} onFacetClick={callback} context={data}/>)
  }
  
 
}

class SubjectHeadingsTab extends Tab  {

  constructor() {
    super()

    this.id = "subjectheadings"
    this.filter = "{!tag=subjectheadings}type:(*Concept)"
    this.label = "Subject Headings"
 
    this.displayer = new SubjectHeadingsTabDisplayer()
 
    this.filterer = new SubjectHeadingsFilterer(this.filter)

    //let fields = [{label: 'Name', value: 'nameRaw.0'}]
    //this.downloader = new TabDownloader(fields)
  }


}

export default SubjectHeadingsTab

