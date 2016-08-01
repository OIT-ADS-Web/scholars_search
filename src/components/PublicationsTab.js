import React, { Component } from 'react';

import PublicationDisplay from './PublicationDisplay'

import IsAbstractTab from './IsAbstractTab'

class PublicationsTab extends IsAbstractTab(Component)  {

  constructor(props) {
    super(props)
  }

  pickDisplay(doc, highlight) {
    return <PublicationDisplay key={doc.DocId} doc={doc} highlight={highlight}/> 
  }

}

export default PublicationsTab 

