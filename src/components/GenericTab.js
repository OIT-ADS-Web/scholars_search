import React, { Component } from 'react';

import GenericDisplay from './GenericDisplay'

import IsAbstractTab from './IsAbstractTab'

class GenericTab extends IsAbstractTab(Component)  {

  constructor(props) {
    super(props)
  }

  pickDisplay(doc, highlight) {
    return <GenericDisplay key={doc.DocId} doc={doc} highlight={highlight}/> 
  }

}


export default GenericTab 
