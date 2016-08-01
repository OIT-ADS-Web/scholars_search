import React, { Component } from 'react';

import ArtisticWorkDisplay from './ArtisticWorkDisplay'

import IsAbstractTab from './IsAbstractTab'

class ArtisticWorksTab extends IsAbstractTab(Component)  {

  constructor(props) {
    super(props)
  }

  pickDisplay(doc, highlight) {
    return <ArtisticWorkDisplay key={doc.DocId} doc={doc} highlight={highlight}/> 
  }

}

export default ArtisticWorksTab 

