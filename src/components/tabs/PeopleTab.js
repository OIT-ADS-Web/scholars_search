import React, { Component } from 'react';

import HasSolrData from '../HasSolrData'
import ScholarsLink from '../ScholarsLink'

class PersonDisplay extends HasSolrData(Component) {

  constructor(props) {
    super(props);
    this.doc = this.props.doc;
    this.highlight = this.props.highlight
  }

  f(str) {
    return (str || "").replace(/&#039;/g,"'");
  }

  hasThumbnail() {
    let flag = false

    if (this.doc.THUMBNAIL != "0") {
      flag = true
    }

    return flag
  }

  get primaryEmail() {
    let emailText = ''
    if (this.doc.primaryEmail_text) {
      emailText = this.doc.primaryEmail_text
    }
    return emailText
  }

  get profileURL() {
    let urlText = ''
    if (this.doc.profileURL_text) {
      urlText = this.doc.profileURL_text
    } else {
      urlText = this.doc.URI
    }

    return urlText
  }

  filterHighlightText(text) {
    return text
  }

  get department() {
    // NOTE: department_search_text field can look like this:
    //
    //"department_search_text": [
    //  "\"Medicine, Cardiology\"",
    //  "Medicine",
    //  "Clinical Science Departments",
    //  "School of Medicine",
    //  "Duke Clinical Research Institute",
    //  "Institutes and Centers"
    //]
    // 
    let departmentText = ''
    if (this.doc.department_search_text) {
      departmentText = this.doc.department_search_text[0]
    }
    return departmentText.replace(/"/g, "")
  }

  get thumbnailUrlAdjusted() {
    let orig = this.doc.THUMBNAIL_URL

    // FIXME: this seems like a fragile solution
    let newLoc = orig.replace("https://scholars.duke.edu/individual/i", "https://scholars.duke.edu/individual/t")

    return newLoc
  } 

  get thumbnailUrl() {
    // NOTE: looks like this:
    // https://scholars.duke.edu/individual/i4284062
    //
    return this.doc.THUMBNAIL_URL
  }

  render() {

    let picture
    
    if (this.hasThumbnail()) {
      picture = <div className="crop"><img src={this.thumbnailUrlAdjusted} className="profile-thumbnail"></img></div>
    } else {
      // just empty instead of a picture size block, to save space
      picture = <span></span>
      //picture = <img className="profile-thumbnail"></img>
    }

    return (
        <div className="person search-result-row" key="{this.docId}">
           <div className="row">
            
               <div className="col-lg-2 col-md-12 col-xs-12 col-sm-12">
                 {picture}
               </div>
            
               <div className="col-lg-10 col-md-12 col-xs-12 col-sm-12">
                 <strong>
                   <ScholarsLink uri={this.profileURL} text={this.name} />
                 </strong>
                 <span> - {this.preferredTitle}</span>
                 <div>{this.department}</div>
                 <div>{this.highlightDisplay}</div>

               </div>

           </div>
           
         {this.solrDocDisplay}
 
       </div>

    )
  }

}


import FacetItem from '../FacetItem'
import Facets from '../Facets'

import HasFacets from '../HasFacets'

import { FacetHelper } from '../Tab'

class PeopleFacets extends HasFacets(Component) {

  constructor(props) {
    super(props)
    
    this.onFacetClick = props.onFacetClick
    this.facets = [{field: "department_facet_string", prefix: "dept", label: "School/Unit"}]
  
  }


  // FIXME: have to override this for now because the labels for the factes require
  // some logic - could probably come up with a better way though
  facetItems(facet_fields, field, prefix, chosen_facets, context) {

    let helper = new FacetHelper()
    let results = helper.parseFacetFields(facet_fields)

    // FIXME: not sure how to deal with the situation generically - as more tabs need more custom labels for facet URIs
    let departmentNameMap = helper.mapURIsToName(context)

    if (field === "department_facet_string") {
      let helper = new FacetHelper()
      let results = helper.parseFacetFields(facet_fields)
 
      let items = results["department_facet_string"]
 
      let list  = _.map(items, (item) => {
        let department_uri = item.label ? item.label.replace("1|", "") : "None" 
        let facetLabel = item.label ? departmentNameMap[department_uri] : "None"
        let org_id = item.label ? item.label.replace(/1\|https:\/\/scholars.duke.edu\/individual\//g, "dept_") : "dept_null"

        let facetItem = (
            <FacetItem key={org_id} assigned_id={org_id} count={item.count} chosen_ids={chosen_facets} onFacetClick={this.onFacetClick} facetLabel={facetLabel} title={department_uri} />
        )
        return facetItem
      })
      return list

    } else {
     return super.facetItems(facet_fields, field, prefix, chosen_facets, context)
    }
      
   }


  render() {
    const { facet_fields, chosen_facets, context } = this.props
    
    if (!context) {
      return ""
    }

    let facetDisplay = this.facetFieldsDisplay(facet_fields, chosen_facets, context)
 
    return (
      <Facets>
        {facetDisplay }
      </Facets>
     )

  }

 }


import Tab from '../Tab'
import { TabDisplayer, TabFilterer, TabDownloader } from '../Tab'

class PeopleDisplayer extends TabDisplayer {

  constructor() {
    super()
  }

  
  individualDisplay(doc, highlight) {
    return <PersonDisplay key={doc.DocId} doc={doc} highlight={highlight}/> 
  }

  facetDisplay(facet_counts, chosen_ids, callback, data) {
    let facet_fields = facet_counts.facet_fields
    return (<PeopleFacets facet_fields={facet_fields} chosen_facets={chosen_ids} onFacetClick={callback} context={data}/>)
  }

}

import { Faceter } from '../Tab'

class PeopleFilterer extends TabFilterer {

  constructor(config) {
    super(config)
    this.facets = [{field: "department_facet_string", prefix: "dept", options: {prefix: "1|", mincount: "1"}}]
  }

 
  // NOTE: these two methods are exactly the same in the two faceted examples - so could
  // just factor out completely 
  //
  applyFilters(searcher) {
    super.applyFilters(searcher)
 
    _.forEach(this.facets, (value, key) => {
       this.applyFacet(searcher, value.field, value.prefix, value.options)
    })
  }
  
  // NOTE: this is called by saga
  applyOptionalFilters(searcher) {

    // FIXME: faceter needs to *AND* between each collection of *OR*
    // even though it is reading multiple facets (from this.facets) it would not
    // handle multiple facets correctly now
    //
    _.forEach(this.facets, (value, key) => {
      let faceter = new Faceter(searcher, value.field, this.facet_ids, value.prefix)
      faceter.applyFacet()
    })
   
  }

}


class PeopleTab extends Tab {

  constructor() {
    super()

    this.id = "person"
    this.filter = "{!tag=person}type:(*Person)"
    this.label = "People"
       
    this.filterer = new PeopleFilterer(this.filter)
    this.displayer = new PeopleDisplayer()

    let fields = [{label: 'Name', value: 'nameRaw.0'}, {label: 'title', value: 'PREFERRED_TITLE.0'}, 
      { label: 'email', value: 'primaryEmail_text',  default: ''}, 
      { label: 'profileUrl', value: 'profileUrl_text', default: ''}
    ]
 
    this.downloader = new TabDownloader(fields)
  }


}


export default PeopleTab 

