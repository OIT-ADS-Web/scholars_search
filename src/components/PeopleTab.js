import React, { Component } from 'react';

import AbstractTab from './AbstractTab'

// needed for thumbnail stuff, I guess
require('../styles/scholars_search.less');

import HasSolrData from './HasSolrData'
import ScholarsLink from './ScholarsLink'

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

  // We discussed potentially trimming the ALLTEXT to remove the ending string of text. This text often shows up 
  // in the highlighting and it is irrelevant (screenshot attached). If we can't easily remove the citation 
  // style text (which will vary), can we at least remove everything from 'Agent' to the end?

  // For example:
  // "Chicago-Style Citation Agent Continuant Entity Faculty Member Independent Continuant Person" 

  // Agent Continuant Entity Faculty Member Independent Continuant Person
  //  Agent Continuant Entity Independent Continuant Person Student
  filterHighlightText(text) {
    let replaced = text.replace("Agent Continuant Entity Faculty Member Independent Continuant Person", "")
    replaced = replaced.replace("Agent Continuant Entity Independent Continuant Person Student", "")
    replaced = replaced.replace("Agent Continuant Entity Independent Continuant Non-Faculty Academic Person", "")

    return replaced
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
                   <ScholarsLink uri={this.URI} text={this.name} />
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


class PeopleTab extends AbstractTab(Component)  {

  constructor(props) {
    super(props)
  }

  pickDisplay(doc, highlight) {
    return <PersonDisplay key={doc.DocId} doc={doc} highlight={highlight}/> 
  }

  //searcher.setFacetField("department_facet_string", {prefix: "1|",  missing: "true"})
  /* results can look like this:

  facet_counts:
   { facet_queries: {},
     facet_fields: { department_facet_string: [Object] },

  [ '1|https://scholars.duke.edu/individual/org50000761',
  6,
  '1|https://scholars.duke.edu/individual/org50000299',
  3,
  '1|https://scholars.duke.edu/individual/org50000491',
  3,
  '1|https://scholars.duke.edu/individual/org50496347',
  1,
  '1|https://scholars.duke.edu/individual/org50000471',
  0,
  null,
  4 ]
  */

  facetFields() {
    return [
      {field: 'department_facet_string', options: {prefix: "1|", missing: "true"}} 
    ]
  }


  csvFields() {
    let firstEntryBeforeSpace = function(row) {
      let str = row['ALLTEXT.0']
      let result = str.substr(0, str.indexOf(' '))
      return result
    }

    return [{label: 'Name', value: 'nameRaw.0'}, {label: 'title', value: 'PREFERRED_TITLE.0'}, 
        { label: 'email', value: 'ALLTEXT.2',  default: ''}, 
        { label: 'profileUrl', value: function(row) { return firstEntryBeforeSpace(row)}, default: ''}
    ]
  }

}


export default PeopleTab 

