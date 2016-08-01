import React, { Component } from 'react';

import SubjectHeadingDisplay from './SubjectHeadingDisplay'

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


  sortOptions() {
    return ['sort desc', 'sort asc']
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
       {id: 'sh_name_fcq', label: 'Name', query: `{!ex=match}nameText:${base_qry}`}, 
       {id: 'sh_text_fcq', label: 'Text', query: `{!ex=match}ALLTEXT:${base_qry}`}
    ]
  }


}


export default SubjectHeadingsTab 

