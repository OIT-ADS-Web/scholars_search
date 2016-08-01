import React, { Component } from 'react';

import OrganizationDisplay from './OrganizationDisplay'

import IsAbstractTab from './IsAbstractTab'

class OrganizationsTab extends IsAbstractTab(Component)  {

  constructor(props) {
    super(props)
  }

  pickDisplay(doc, highlight) {
    return <OrganizationDisplay key={doc.DocId} doc={doc} highlight={highlight}/> 
  }

}


export default OrganizationsTab 

