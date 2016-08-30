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

    replaced = replaced.replace("Chicago-Style Citation", "")

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


import FacetList from './FacetList'
import FacetItem from './FacetItem'

class PeopleTab extends Tab {

  constructor(config) {
    super()
    this.config = config
  }

  
  //   { id: "person", filter: "{!tag=person}type:(*Person)", label: "People" },
  applyFilters(searcher) {
    super.applyFilters(searcher)
 
    // FIXME: these are a little persnickety, if you leave off the localParam it'll
    // crash - or if you leave off the facetField too
    //
    searcher.setFacetField("department_facet_string", {prefix: "1|",  mincount: "1"})
    searcher.setFacetLocalParam("department_facet_string", "{!ex=dept}")
 
    searcher.setFacetField("mostSpecificTypeURIs", {mincount: "1"})
    searcher.setFacetLocalParam("mostSpecificTypeURIs", "{!ex=type}")

    this.applyOptionalFilters(searcher)
  }

  // FIXME: this *has* to be called BEFORE applyFilters()
  // which is annoying becuase it's an implementation details in this file
  // that you have to remember in other files
  //
  setActiveFacets(chosen_ids) {
    this.filters = chosen_ids
  }
 
  applyOptionalFilters(searcher) {
   
    // FIXME: wow - this is super ugly, have to build or queries from facets
    // picked - but each facets has it's own unique query building logic 
    // there's one big code block per facet
    //
    //
    // 1. department facet
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


  get departmentNameMap() {
    // FIXME: should probably centralize this more - even though it's only used here right now
    let departmentNameMap = {}
    _.forEach(this.data.departments, function(obj) {
       departmentNameMap[obj.URI] = obj.name
    })
    return departmentNameMap
  }

  // need departments in here, somehow
  facetFieldDisplay(facet_fields, chosen_ids, cb) {
    let size = facet_fields.length

    if (!(facet_fields || size > 0)) {
      return ""
    }

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

    // FIXME: need a generalized way to display facets
    let departmentNameMap = this.departmentNameMap

    // NOTE: data is blank for a while, but it doesn't seem to make a difference unless I try to call <FacetItem />

    let items = results['department_facet_string']
    let types = results['mostSpecificTypeURIs']
 
    // FIXME: seems like this should work, but it does not
    let department_list  = _.map(items, (item) => {
  
      let department_uri = item.label ? item.label.replace("1|", "") : "None" 
      let facetLabel = item.label ? departmentNameMap[department_uri] : "None"
      let org_id = item.label ? item.label.replace(/1\|https:\/\/scholars.duke.edu\/individual\//g, "dept_") : "dept_null"

      /*
      let facetData = {org_id: org_id, 
        assigned_id: org_id, 
        count: item.count, 
        chosen_ids: chosen_ids, 
        facetLabel: label, 
        title: department_uri,
        onFacetClick: cb
      }

      return facetData
      */

      // FIXME: seems like this should work, but it does not
      //let facetItem = (
      //    <FacetItem key={org_id} assigned_id={org_id} count={item.count} chosen_ids={chosen_ids} onFacetClick={cb} facetLabel={facetLabel} title={department_uri} />
      //)
      //return facetItem
     
      if (chosen_ids.indexOf(org_id) > -1) {
        
        return (
            <li className="list-group-item facet-item active">
              <span title={department_uri} className="badge">{item.count}</span>
              <label forHtml={org_id} >
                <input id={org_id} onClick={(e) => cb(e)} ref={org_id} type="checkbox" defaultChecked={true} />
                <span className="facet-label">{facetLabel}</span>
              </label>
            </li>
          )
        
      } else {
         
        return (
          <li className="list-group-item facet-item">
            <span title={department_uri} className="badge">{item.count}</span> 
            <label forHtml={org_id}>
              <input id={org_id} onClick={(e) => cb(e)} ref={org_id} type="checkbox" />
              <span className="facet-label">{facetLabel}</span>
            </label>
          </li>
        )
       
      }

    })

    let position_list = _.map(types, (item) => {
     // looks like this:
     //http://vivoweb.org/ontology/core#FacultyMember
     let facetLabel = item.label ? item.label.replace(/http:\/\/vivoweb.org\/ontology\/core#/g, "") : "type_null"
     let type_id = item.label ? item.label.replace(/http:\/\/vivoweb.org\/ontology\/core#/g, "type_") : "type_null"

     if (chosen_ids.indexOf(type_id) > -1) {
      return (
          <li className="list-group-item facet-item active">
            <span className="badge">{item.count}</span>
            <label forHtml={type_id}>
              <input id={type_id} onClick={(e) => cb(e)} ref={type_id} type="checkbox" defaultChecked={true}/>
              <span className="facet-label">{facetLabel}</span>
            </label>
          </li>
        )
 
    } else {

      return (
          <li className="list-group-item facet-item">
            <span className="badge">{item.count}</span>
            <label forHtml={type_id}>
              <input id={type_id} onClick={(e) => cb(e)} ref={type_id} type="checkbox" />
              <span className="facet-label">{facetLabel}</span>
            </label>
          </li>
        )

      }
    })


    //let departmentFacets = (<FacetList label="Departments" onFacetClick={cb} chosen_ids={chosen_ids} results={department_list} />)
    //let departmentFacets = (<FacetList label="Departments" onFacetClick={cb} chosen_ids={chosen_ids}>{department_list}</FacetList>)
    let departmentFacets = (<FacetList label="Departments">{department_list}</FacetList>)
    let positionTypeFacets = (<FacetList label="Position Type">{position_list}</FacetList>)
 
    //let positionTypeFacets = (
    //  <ul className="list-group">
    //    <h4 className="list-group-item-heading">Position Type</h4>
    //      {position_list}
    //  </ul>
    //)
     
    let facets = (
      <div>
        {departmentFacets}
        {/*positionTypeFacets*/}
      </div>
    )
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

