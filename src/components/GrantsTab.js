import React, { Component } from 'react';

import GrantDisplay from './GrantDisplay'

import IsAbstractTab from './IsAbstractTab'

class GrantsTab extends IsAbstractTab(Component)  {

  constructor(props) {
    super(props)
  }

  pickDisplay(doc, highlight) {
    return <GrantDisplay key={doc.DocId} doc={doc} highlight={highlight}/> 
  }

}

export default GrantsTab 

