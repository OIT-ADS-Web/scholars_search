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


import IsAbstractTab from './IsAbstractTab'

class SubjectHeadingsTab extends IsAbstractTab(Component)  {

  constructor(props) {
    super(props)
  }

  csvFields() {
    return [{label: 'Name', value: 'nameRaw.0'}
    ]
  }

  pickDisplay(doc, highlight) {
    // FIXME: could just embed this object in there, instead of calling it
    // as a component/seperate file like this
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
 
  filterQueries(base_qry) {
    return [
      {id: 'sh_name_fq', tag: 'match', query: `{!tag=match}nameText:${base_qry}`}
    ]
  }

  facetQueries(base_qry) {
    return [
       {id: 'sh_name_fcq', label: 'Match Name', query: `{!ex=match}nameText:${base_qry}`}, 
       {id: 'sh_text_fcq', label: 'Match Text', query: `{!ex=match}ALLTEXT:${base_qry}`}
    ]
  }

  sortOptions() {
    return ['sort desc', 'sort asc']
  }



}


export default SubjectHeadingsTab 

