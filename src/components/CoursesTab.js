import React, { Component } from 'react';

import CourseDisplay from './CourseDisplay'

import IsAbstractTab from './IsAbstractTab'

class CoursesTab extends IsAbstractTab(Component)  {

  constructor(props) {
    super(props)
  }

  pickDisplay(doc, highlight) {
    return <CourseDisplay key={doc.DocId} doc={doc} highlight={highlight}/> 
  }

}


export default CoursesTab 
