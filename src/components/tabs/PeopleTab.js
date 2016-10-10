import React, { Component } from 'react';

import HasSolrData from '../HasSolrData'
import ScholarsLink from '../ScholarsLink'

class PersonDisplay extends HasSolrData(Component) {

  constructor(props) {
    super(props);
    this.doc = this.props.doc;
    this.highlight = this.props.highlight
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

  get nameReversed() {
    // Just in case the name is blank, don't want app to crash
    let name = this.name ? this.name : this.URI
    return name.split(",").reverse().join(" ").trim()
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
                 <span className="name">
                   <ScholarsLink uri={this.profileURL} text={this.nameReversed} />
                 </span>
                 <div>{this.preferredTitle}</div>
                 <div>{this.highlightDisplay}</div>

               </div>

           </div>
           
         {this.solrDocDisplay}
 
       </div>

    )
  }

}


import Facets from '../Facets'
import HasFacets from '../HasFacets'

class PeopleFacets extends HasFacets(Component) {

  constructor(props) {
    super(props)
    
    this.onFacetClick = props.onFacetClick
    this.facets = props.facets
  }


  // NOTE: have to override to get the right label for departments, otherwise this would be unnecessary
  // matching on 'prefix' - and if/then/else
  //
  // not crazy about this solution - might be better to populate a departmant_facet_string_name field
  // (for instance) with the actual names -- to avoid this odd customization and also prevent 
  // the UI lag that happens when we have the facet counts, but not the facet labels
  //
  facetItem(prefix, item, context) {

    // FIXME: this is real specific to PeopleFacets maybe should be defined in this class
    let departmentNameMap = this.mapURIsToName(context)

    if(prefix === 'dept') {
      let department_uri = item.label ? item.label.replace("1|", "") : "None" 
      let facetLabel = item.label ? departmentNameMap[department_uri] : "None"
      let org_id = item.label ? item.label.replace(/1\|https:\/\/scholars.duke.edu\/individual\//g, "dept_") : "dept_null"
      return { id: org_id, title: department_uri, label: facetLabel, value: item.label}
    } else {
      return super.facetItem(prefix, item, context)
    }

  }
  
  render() {
    const { facet_fields, chosen_facets, context } = this.props
 
    // FIXME: if we don't have the context - should leave blank
    // (so departments don't show up as blank) - 
    // that's the idea, but this doesn't accomplish that 
    //
    if (!context) {
      return ""
    }

    let facetDisplay = this.facetFieldsDisplay(facet_fields, chosen_facets, context)
 
    return (
      <Facets>
        {facetDisplay}
      </Facets>
     )

  }

 }


import Tab from '../Tab'
import { TabDisplayer, TabFilterer, TabDownloader } from '../Tab'

class PeopleDisplayer extends TabDisplayer {

  constructor() {
    super()

    this.facets = [{field: "department_facet_string", prefix: "dept", label: "School/Unit"}]
 
    // NOTE: this actually works
    //this.facets = [
    //   {field: "department_facet_string", prefix: "dept", label: "School/Unit"},
    //   {field: "mostSpecificTypeURIs", prefix: "type", label: "Type"}
    // ]
 
  }

  individualDisplay(doc, highlight) {
    return <PersonDisplay key={doc.DocId} doc={doc} highlight={highlight}/> 
  }

  facetDisplay(facet_counts, chosen_ids, callback, data) {
    let facet_fields = facet_counts.facet_fields
    return (<PeopleFacets facets={this.facets} facet_fields={facet_fields} chosen_facets={chosen_ids} onFacetClick={callback} context={data}/>)
  }

}

class PeopleFilterer extends TabFilterer {

  constructor(config) {
    super(config)
    this.facets = [{field: "department_facet_string", prefix: "dept", options: {prefix: "1|", mincount: "1"}}]
 
    // NOTE: this actually works
    //this.facets = [
    //  {field: "department_facet_string", prefix: "dept", options: {prefix: "1|", mincount: "1"}},
    //  {field: "mostSpecificTypeURIs", prefix: "type", options: {mincount: "1"}}
    //]
 
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
      { label: 'email', value: 'primaryEmail_text.0',  default: ''}, 
      { label: 'profileUrl', value: 'profileURL_text.0', default: ''}
    ]
 
    this.downloader = new TabDownloader(fields)
  
    // FIXME: could we do something like this so facet fields are only defined once:
    // let facets = [
    //   {field: "department_facet_string", prefix: "dept", label: "School/Unit", options={prefix: "1|", mincount: "1"}},
    //   {field: "mostSpecificTypeURIs", prefix: "type", label: "Type", options={mincount: "1"}}
    // ]
    //
    // filterer.facets = facets
    // displayer.facets = facets
    //
 
  }


}


export default PeopleTab 

