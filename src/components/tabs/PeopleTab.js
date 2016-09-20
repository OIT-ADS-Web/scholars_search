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

    //let replaced = text.replace("Agent Continuant Entity Faculty Member Independent Continuant Person", "")
    //replaced = replaced.replace("Agent Continuant Entity Independent Continuant Person Student", "")
    //replaced = replaced.replace("Agent Continuant Entity Independent Continuant Non-Faculty Academic Person", "")

    //replaced = replaced.replace("Chicago-Style Citation", "")
    //return replaced
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


import FacetList from '../FacetList'
import FacetItem from '../FacetItem'
import Facets from '../Facets'

class PeopleFacets extends Component {

  constructor(props) {
    super(props)
    
    this.onFacetClick = props.onFacetClick
   }

  departmentNameMap(data) {
    // FIXME: should probably centralize this more - even though it's only used here right now
    let departmentNameMap = {}
    _.forEach(data, function(obj) {
       departmentNameMap[obj.URI] = obj.name
    })
    return departmentNameMap
  }

  facetFieldDisplay(facet_fields, chosen_facets, context) {
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
  
    let departmentNameMap = this.departmentNameMap(context)

    // NOTE: data is blank for a while, but it doesn't seem to make a difference unless I try to call <FacetItem />
    let items = results['department_facet_string']
 
    // FIXME: seems like this should work, but it does not
    let department_list  = _.map(items, (item) => {
  
      let department_uri = item.label ? item.label.replace("1|", "") : "None" 
      let facetLabel = item.label ? departmentNameMap[department_uri] : "None"
      let org_id = item.label ? item.label.replace(/1\|https:\/\/scholars.duke.edu\/individual\//g, "dept_") : "dept_null"

      let facetItem = (
          <FacetItem key={org_id} assigned_id={org_id} count={item.count} chosen_ids={chosen_facets} onFacetClick={this.onFacetClick} facetLabel={facetLabel} title={department_uri} />
      )
      return facetItem
     
    })

    let departmentFacets = (<FacetList label="School/Unit">{department_list}</FacetList>)
 
    let facets = (
      <div className="facet-panel">
        <h4 className="heading">Filter By</h4>
        {departmentFacets}
      </div>
    )

    return facets
  }

  render() {
    const { facet_fields, chosen_facets, context } = this.props
    
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
import { TabDisplayer, TabFilterer, TabDownloader } from '../Tab'

class PeopleDisplayer extends TabDisplayer {

  constructor() {
    super()
  }

  pickDisplay(doc, highlight) {
    return <PersonDisplay key={doc.DocId} doc={doc} highlight={highlight}/> 
  }

  facets(facet_counts, chosen_ids, callback, data) {
    let facet_fields = facet_counts.facet_fields
    return (<PeopleFacets facet_fields={facet_fields} chosen_facets={chosen_ids} onFacetClick={callback} context={data}/>)
  }

}

class PeopleFilterer extends TabFilterer {

  constructor(config) {
    super(config)
  }

  //   { id: "person", filter: "{!tag=person}type:(*Person)", label: "People" },
  applyFilters(searcher) {
    super.applyFilters(searcher)
 
    // FIXME: these are a little persnickety, if you leave off the localParam it'll
    // crash - or if you leave off the facetField too
    //
    searcher.setFacetField("department_facet_string", {prefix: "1|",  mincount: "1"})
    searcher.setFacetLocalParam("department_facet_string", "{!ex=dept}")
 
    //searcher.setFacetField("mostSpecificTypeURIs", {mincount: "1"})
    //searcher.setFacetLocalParam("mostSpecificTypeURIs", "{!ex=type}")

    this.applyOptionalFilters(searcher)
  }

  applyOptionalFilters(searcher) {
 
    console.log(`applyOptionFilters: ${this.facet_ids}`)

    // FIXME: wow - this is super ugly, have to build or queries from facets
    // picked - but each facets has it's own unique query building logic 
    // so there needs to be one big code block per facet
    // 
    //
    // 1(a). department facet
    let dept_filters = _.filter(this.facet_ids, function(id) {
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

    // 1(b). gather those into a big OR query
    if(dept_list.length > 0) {
       let or_collection = dept_list.join(' OR ')
       let qry = `{!tag=dept}${or_collection}`
       //let qry = `${or_collection}`
       searcher.addFilter("dept", qry)
     }

    /* NOTE: this is what a second one would look like ... nearly the same, but not quite
     *
    // 2(a). type facet
    let type_filters = _.filter(this.facet_ids, function(id) {
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

    // 2(b). gather those into a big OR query
    if(type_list.length > 0) {
       let or_collection = type_list.join(' OR ')
       let qry = `{!tag=type}${or_collection}`
       //let qry = `${or_collection}`
       searcher.addFilter("type", qry)
     }
    */

    
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

