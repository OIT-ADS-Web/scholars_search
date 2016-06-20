import React from 'react'

import PersonDisplay from './PersonDisplay'
import PublicationDisplay from './PublicationDisplay'
import OrganizationDisplay from './OrganizationDisplay'
import GenericDisplay from './GenericDisplay'
import ArtisticWorkDisplay from './ArtisticWorkDisplay'
import SubjectHeadingDisplay from './SubjectHeadingDisplay'
import GrantDisplay from './GrantDisplay'
import CourseDisplay from './CourseDisplay'

import json2csv from 'json2csv'

// FIXME: don't know if this is that great of an idea, just
// wanted some centralized splitter of stuff based on filter
class TabPicker {

  constructor(filter) {
    this.filter = filter
  }


  toCSV(json) {

    let data = json.response.docs
    let fields = ['URI', 'DocId', 'score']

    // FIXME: could use this to pick fields ... different per tab
    switch(this.filter) {

    case 'person':
      // fields = ['URI', 'email', 'score']
      break
    case 'publications':
      break
    case 'organizations':  
      break
    case 'subjectheadings':  
      break
    case 'artisticworks':  
      break
    case 'grants':  
      break
    case 'courses':  
      break
    default:  
      //
    }

    var _csv = ""
    if (data) {
      json2csv({data: data, fields: fields, flatten: true}, function(err, csv) {
        if (err) {
          console.log(err)
        }
        else {
          _csv = csv
        }
      })
    }

    // NOTE: needs to be an array for Blob function do that here?
    var ary = []
    ary.push(_csv)
    return ary

  }

  pickDisplay(doc, highlight) {
    
    switch(this.filter) {
    case 'person':
      return <PersonDisplay key={doc.DocId} doc={doc} display={highlight}/> 
    case 'publications':
      return <PublicationDisplay key={doc.DocId} doc={doc} display={highlight}/> 
    case 'organizations':  
      return <OrganizationDisplay key={doc.DocId} doc={doc} display={highlight}/> 
    case 'subjectheadings':  
      return <SubjectHeadingDisplay key={doc.DocId} doc={doc} display={highlight}/> 
    case 'artisticworks':  
      return <ArtisticWorkDisplay key={doc.DocId} doc={doc} display={highlight}/> 
    case 'grants':  
      return <GrantDisplay key={doc.DocId} doc={doc} display={highlight}/> 
    case 'courses':  
      return <CourseDisplay key={doc.DocId} doc={doc} display={highlight}/> 
    default:  
      return <GenericDisplay key={doc.DocId} doc={doc} display={highlight}/> 
    }
  }


}


export default TabPicker
