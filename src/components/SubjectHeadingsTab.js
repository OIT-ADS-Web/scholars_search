import React, { Component } from 'react';

import HasSolrData from './HasSolrData'
import ScholarsLink from './ScholarsLink'

import meshLogo from '../images/meshhead.gif'
import locLogo from '../images/loc-logo.png'
import dukeLogo from '../images/duke-text-logo.png'

class SubjectHeadingDisplay extends HasSolrData(Component) {

  constructor(props) {
    super(props);
    this.doc = this.props.doc;
    this.highlight = this.props.highlight
  }

  render() {
    let meshMatch = /^https:\/\/scholars.duke.edu\/individual\/mesh*/
    let locMatch = /^http:\/\/id.loc.gov\/authorities\/subjects\/*/
 
    let uri = this.URI
    let isMesh = meshMatch.test(uri)
    let isLoc = locMatch.test(uri)
    
    let logo = function() {
      if (isMesh) {
        return meshLogo
      } else if (isLoc) {
        return locLogo 
      } else {
        return dukeLogo
      }
    }()

    if (isLoc) {
      uri = `https://scholars.duke.edu/individual?uri=${encodeURIComponent(this.URI)}`
    }

    return (
         <div className="generic search-result-row" key="{this.docId}">
            <div className="row">
              <div className="col-md-12 col-xs-12 col-sm-12"> 
                 <strong>
                  <ScholarsLink uri={uri} text={this.name} />
                </strong>
                <div className="pull-right">
                   <img width="18px" src={logo}/>
                </div>
              </div>
            </div>
            
            {this.solrDocDisplay}
 
        </div>
    )
  }

}


import Tab from './Tab'

// export class SubjectHeadingsTab extends SearchResults {
//
// }
//
export class SubjectHeadingsTab extends Tab {
//export class SubjectHeadingsTab extends AbstractTab(Component)  {

  get csvFields() {
    return [{label: 'Name', value: 'nameRaw.0'}
    ]
  }

  pickDisplay(doc, highlight) {
    return <SubjectHeadingDisplay key={doc.DocId} doc={doc} highlight={highlight}/> 
  }

  /*
    NOTE: the {!ex...} part is what makes showing counts for queries even when filter is on
    the 'match' part is just an arbitary name given by the {!tag=...} SOLR local parameter 
  
   leads to this going to searcher:

   searcher.setFacetQuery(`{!ex=match}nameText:${qry}`)
   searcher.setFacetQuery(`{!ex=match}ALLTEXT:${qry}`)

   searcher.addFilter("match", `{!tag=match}nameText:${qry}`)
 
  */

  constructor(props) {
    super(props)

    this.filters = []

  }

  applyFilters(searcher) {
    super.applyFilters(searcher)

    // NOTE: will need query already defined here, so order of operations
    // matters a bit
    let qry = searcher.query

    // ? replace qry with searcher.qry in saga?
    searcher.setFacetQuery(`{!ex=match}nameText:${qry}`)
    searcher.setFacetQuery(`{!ex=match}ALLTEXT:${qry}`)

    this.applyOptionalFilters(searcher)
  }

  // NOTE: this would need to be called BEFORE applyFilters()
  //
  setActiveFacets(chosen_ids) {
    this.filters = chosen_ids
  }
 
  applyOptionalFilters(searcher) {
    //let qry = searcher.qry
    let _self = this

    let query_list = [ 
       {id: 'sh_name_fcq',  query: "nameText"}, 
       {id: 'sh_text_fcq', query: "ALLTEXT"}
    ]
 
    let list = _.map(this.filters, function(id) {
      let facet = _.find(query_list, function(o) { return o.id === id })
      
      let filter = facet.query
      let qry = searcher.query
      
      return `{!tag=match}${filter}:${qry}`
    })

    let or_collection = list.join(' OR ')
    searcher.addFilter("facets", or_collection)

  }

  //let or_collection = filter_query_list.join(' OR ')
  //  searcher.addFilter(filterKey, or_collection)

  getFacetQueryById(id) {
    let query_list = [ 
       {id: 'sh_name_fcq', label: 'Name Only', query: "{!ex=match}nameText"}, 
       {id: 'sh_text_fcq', label: 'Any Text', query: "{!ex=match}ALLTEXT"}
    ]
 
    let found = _.find(query_list, function(o) { return o.id === id })
    return found
  }


  // this matches our internal - conceptual - query with what has been
  // stored as the key of the results sent back from SOLR (in facet_queries: [])
  getFacetQueryByQuery(qry) {
    var base_qry= qry.substr(0, qry.indexOf(':')) 

    let query_list = [ 
       {id: 'sh_name_fcq', label: 'Name Only', query: "{!ex=match}nameText"}, 
       {id: 'sh_text_fcq', label: 'Any Text', query: "{!ex=match}ALLTEXT"}
    ]
 
    let found = _.find(query_list, function(o) { return o.query === base_qry })
    return found
  }


  facets(facet_counts, chosen_ids, cb) {
    let facet_queries = facet_counts.facet_queries
    
    let _self = this
    // NOTE: chosen_ids can't be this.filters at this point
    //
    //let chosen_ids = _self.filters
 
    let facet_list = Object.keys(facet_queries).map(function (key) {
      let item = facet_queries[key]
      
      let facetQuery = _self.getFacetQueryByQuery(key)
 
      //let facetQuery = null
      // if we can't find it - just blank it out
      if (!facetQuery) {
        return ""
      }

      let label = facetQuery.label 

 
      // chosen_ids not set at this point - ordering matter!!
      //
      if (chosen_ids.indexOf(facetQuery.id) > -1) {
        return (
            <li className="list-group-item facet-item">
              <span className="badge">{item}</span>
              <label for={facetQuery.id}>
                <input id={facetQuery.id} onClick={(e) => cb(e)} ref={facetQuery.id} type="checkbox" defaultChecked={true} />
                <span className="facet-label">{label}</span>
              </label>
            </li>
          )
      } else {
        return (
          <li className="list-group-item facet-item">
            <span className="badge">{item}</span> 
            <label for={facetQuery.id}>
              <input id={facetQuery.id} onClick={(e) => cb(e)} ref={facetQuery.id} type="checkbox" />
              <span className="facet-label">{label}</span>
            </label>
          </li>
        )
      }

    })
    let facets = (<ul className="list-group">{facet_list}</ul>)
    return facets
  }


  sortOptions() {
    return ['sort desc', 'sort asc']
  }


}


export default SubjectHeadingsTab

