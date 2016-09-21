import React, { Component } from 'react';

import HasSolrData from '../HasSolrData'
import ScholarsLink from '../ScholarsLink'

class CourseDisplay extends HasSolrData(Component) {

  constructor(props) {
    super(props);
    this.doc = this.props.doc;
    this.highlight = this.props.highlight
  }

  render() {

    return (
         <div className="generic search-result-row" key="{this.docId}">
            <div className="row">
              <div className="col-md-12 col-sm-12">
                <strong>
                  <ScholarsLink uri={this.URI} text={this.name} />
                </strong>
              </div>
            </div>


            {this.solrDocDisplay}
 
        </div>
    );
  }

}


import Tab from '../Tab'

import { TabDisplayer } from '../Tab'

class CoursesTabDisplayer extends TabDisplayer {

  individualDisplay(doc, highlight) {
    return <CourseDisplay key={doc.DocId} doc={doc} highlight={highlight}/> 
  }

}

class CoursesTab extends Tab  {

  constructor() {
    super()
    
    this.id = "courses"
    this.label = "Courses"
    this.filter = "{!tag=courses}type:(*Course)"

    this.displayer = new CoursesTabDisplayer()
  }

}

export default CoursesTab 
