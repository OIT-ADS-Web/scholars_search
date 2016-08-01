import React, { Component } from 'react';

import PersonDisplay from './PersonDisplay'

import IsAbstractTab from './IsAbstractTab'

class PeopleTab extends IsAbstractTab(Component)  {

  constructor(props) {
    super(props)
  }

  pickDisplay(doc, highlight) {
    return <PersonDisplay key={doc.DocId} doc={doc} highlight={highlight}/> 
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

