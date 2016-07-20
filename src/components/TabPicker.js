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

import _ from 'lodash'

// FIXME: don't know if this is that great of an idea, just
// wanted some centralized splitter of stuff based on filter
class TabPicker {

  constructor(filter) {
    this.filter = filter
  }

  // <Tabs>
  //  <PersonTab>
  //  <PublicationTab>...
  // </Tabs>
  //
  // class Tab
  // 
  // class PersonTab extends(Tab) --- ???
  //
  // [Tab] - class ?
  //
  // e.g.
  // display=PersonDisplay
  // filter=(type:Person)
  // downloadFields (see below)
  // sortOptions
  // facets ---
  //
  // ---
  //
  toCSV(json) {

    let data = json.response.docs
    let defaultFields = ['URI', {label: 'Type', value: 'mostSpecificTypeURIs.0'}]
    let extraFields = []

    // FIXME: could use this to pick fields ... different per tab
    switch(this.filter) {
    
    case 'person':
      // NOTE: function(row) { return row.ALLTEXT.2 (and row.ALLTEXT[2])} is an error but value: 'ALLTEXT.2' is not, why?
      extraFields = [{label: 'Name', value: 'nameRaw.0'}, {label: 'title', value: 'PREFERRED_TITLE.0'}, { label: 'email', value: 'ALLTEXT.2',  default: ''}]
      break
    case 'publications':
      extraFields = [{label: 'Name', value: 'nameRaw.0'}, {value: 'ALLTEXT.0'}]
      break
    case 'organizations':  
      extraFields = [{label: 'Name', value: 'nameRaw.0'}, {value: 'ALLTEXT.0'}]
      break
    case 'subjectheadings':  
      extraFields = [{label: 'Name', value: 'nameRaw.0'}]
      break
    case 'artisticworks':  
      extraFields = [{label: 'Name', value: 'nameRaw.0'}, {value: 'ALLTEXT.0'}]
      break
    case 'grants':  
      extraFields = [{label: 'Name', value: 'nameRaw.0'}, {value: 'ALLTEXT.0'}]
      break
    case 'courses':  
      extraFields = [{label: 'Name', value: 'nameRaw.0'}]
      break
    default:  
      //
    }

    let fields = _.concat(defaultFields, extraFields)

    let _csv = ""
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
    let ary = []
    ary.push(_csv)
    return ary

  }

  pickDisplay(doc, highlight) {
    
    switch(this.filter) {
    case 'person':
      return <PersonDisplay key={doc.DocId} doc={doc} highlight={highlight}/> 
    case 'publications':
      return <PublicationDisplay key={doc.DocId} doc={doc} highlight={highlight}/> 
    case 'organizations':  
      return <OrganizationDisplay key={doc.DocId} doc={doc} highlight={highlight}/> 
    case 'subjectheadings':  
      return <SubjectHeadingDisplay key={doc.DocId} doc={doc} highlight={highlight}/> 
    case 'artisticworks':  
      return <ArtisticWorkDisplay key={doc.DocId} doc={doc} highlight={highlight}/> 
    case 'grants':  
      return <GrantDisplay key={doc.DocId} doc={doc} highlight={highlight}/> 
    case 'courses':  
      return <CourseDisplay key={doc.DocId} doc={doc} highlight={highlight}/> 
    default:  
      return <GenericDisplay key={doc.DocId} doc={doc} highlight={highlight}/> 
    }
  }


  sortOptions() {
  // switch(this.filter) {
  // case 'person': 
  // ...
  //
  //
    return ['sort desc', 'sort asc']
  }
}


export default TabPicker
