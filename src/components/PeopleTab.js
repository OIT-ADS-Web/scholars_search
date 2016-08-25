import React, { Component } from 'react';

import Tab from './Tab'

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


class PeopleTab extends Tab {

  constructor(config) {
    super(config)

    this.filters = []
  }

  //   { id: "person", filter: "{!tag=person}type:(*Person)", label: "People" },
  applyFilters(searcher) {
    super.applyFilters(searcher)
    searcher.setFacetField("department_facet_string", {prefix: "1|",  mincount: "1"})

    // FIXME: this showed things like publications - might need to apply the tab filter ??
    //
    //searcher.setFacetField("{!ex=type}mostSpecificTypeURIs", {mincount: "1"})
 
    // NOTE: see in applyOptionalFilters where {!tag=dept} is defined
    //
    searcher.setFacetLocalParam("department_facet_string", "{!ex=dept}")

  
    this.applyOptionalFilters(searcher)
  }

  // NOTE: this would need to be called BEFORE applyFilters()
  //
  setActiveFacets(chosen_ids) {
    this.filters = chosen_ids
  }
 
  applyOptionalFilters(searcher) {

    // each filter is id of active facet ??
    //
    // 1. get list of queries we need to run
    let list = _.map(this.filters, function(id) {
      let uri_to_search = `(1|*individual/${id})`  // FIXME: this must be wrong
 
      if (id == "dept_null") { 
        return `(-department_facet_string:[* TO *] AND *:*)`
      } else {
        return `department_facet_string:${uri_to_search}`
      }
    })

    // 2. gather those into a big OR query
    if(list.length > 0) {
      let or_collection = list.join(' OR ')
      let qry = `{!tag=dept}${or_collection}`
      //let qry = `${or_collection}`
      searcher.addFilter("facets", qry)
     }

    // FIXME: probably need to AND other facets -- right ?
    //
    //
    //
  }

  

  pickDisplay(doc, highlight) {
    return <PersonDisplay key={doc.DocId} doc={doc} highlight={highlight}/> 
  }

  get csvFields() {
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


  // need departments in here, somehow
  facetFieldDisplay(facet_fields, chosen_ids, cb) {
    let size = facet_fields.length

    if (!(facet_fields || size > 0)) {
      return ""
    }

    // FIXME: should probably centralize this more - even though it's only used here right now
    let departmentNameMap = {}
    _.forEach(this.data.departments, function(obj) {
       departmentNameMap[obj.URI] = obj.name
    })
    
    let results = {}
    _.forEach(facet_fields, function(value, key) {
      results[key] = []

      let array = value
      let size = array.length
      let i = 0
      // strangely results are array, of [<count><field>, <count><field> ... ]
      while (i < size) {
        let dept = array[i]
        let count = array[i+1]
        let summary = {dept: dept, count:count}
        results[key].push(summary)
        i = i + 2
      }
    })

    /*
     *  
    "department_facet_string": [
      "3|https://scholars.duke.edu/individual/org50000761|https://scholars.duke.edu/individual/org50000829|https://scholars.duke.edu/individual/org50000832",
      "2|https://scholars.duke.edu/individual/org50000761|https://scholars.duke.edu/individual/org50000829",
      "1|https://scholars.duke.edu/individual/org50000761",
      "4|https://scholars.duke.edu/individual/org50000761|https://scholars.duke.edu/individual/org50000829|https://scholars.duke.edu/individual/org50000844|https://scholars.duke.edu/individual/org50000847",
      "3|https://scholars.duke.edu/individual/org50000761|https://scholars.duke.edu/individual/org50000829|https://scholars.duke.edu/individual/org50000844",
      "2|https://scholars.duke.edu/individual/org50000761|https://scholars.duke.edu/individual/org50000829",
      "1|https://scholars.duke.edu/individual/org50000761"
    ],
    */

    let items = results['department_facet_string']
    
    let facet_list  = items.map(function(item) {
  
      let department_uri = item.dept ? item.dept.replace("1|", "") : "None" 
      let label = item.dept ? departmentNameMap[department_uri] : "None"
      
      let org_id = item.dept ? item.dept.replace(/1\|https:\/\/scholars.duke.edu\/individual\//g, "") : "dept_null"

      if (chosen_ids.indexOf(org_id) > -1) {
        
        return (
            <li className="list-group-item facet-item">
              <span title={department_uri} className="badge">{item.count}</span>
              <label for={org_id} >
                <input id={org_id} onClick={(e) => cb(e)} ref={org_id} type="checkbox" defaultChecked={true} />
                <span className="facet-label">{label}</span>
              </label>
            </li>
          )
        
      } else {
         
        return (
          <li className="list-group-item facet-item">
            <span title={department_uri} className="badge">{item.count}</span> 
            <label for={org_id}>
              <input id={org_id} onClick={(e) => cb(e)} ref={org_id} type="checkbox" />
              <span className="facet-label">{label}</span>
            </label>
          </li>
        )
       
      }

    })

    let facets = (<ul className="list-group">{facet_list}</ul>)
    return facets
  }


  facets(facet_counts, chosen_ids, cb) {
    let facet_fields = facet_counts.facet_fields
    
    let facetFieldDisplay = this.facetFieldDisplay(facet_fields, chosen_ids, cb)
    
    return (
      <div>
        {facetFieldDisplay}
      </div>
     )
  }


}


export default PeopleTab 

