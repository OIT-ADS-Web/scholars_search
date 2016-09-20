import React from 'react'

// NOTE: one way to do this, not the only way
// http://exploringjs.com/es6/ch_classes.html
// http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/

// NOTE: have to assume we are getting 'doc' and 'highlight' props
let HasSolrData = (superclass) => class extends superclass {

  get name() {
    let nameRaw = this.doc.nameRaw || [""]
    return nameRaw[0]
  }

  get preferredTitle() {
    return this.doc.PREFERRED_TITLE
  }

  get docId() {
    return this.doc.DocId
  }

  get allText() {
    let allText = this.doc.ALLTEXT || []
    return allText.join(" ")
  }

  get dukeText() {
    let dukeText = this.doc.duke_text|| []
    return dukeText.join(" ")
  }

  get types() {
    let typeList = this.doc.type || []
    return typeList.join("<br/>")
  }

  get mostSpecificType() {
    // NOTE: sometimes it's just blank, for some reason
    let specificTypes = this.doc.mostSpecificTypeURIs || []
    return specificTypes.join(" ")
  }

  get typeDisplay() {
    let specificTypes = this.doc.mostSpecificTypeURIs || []
    
    /*
    let abbreviation_list = _.map(specificTypes, function(s) {
      let abbreviation = s.split("#")[1] || s
      
      if (abbreviation == s) {
        abbreviation = s.substring(s.lastIndexOf("/") + 1)
      }
      return abbreviation
    })
    */

    // FIXME: despite the data types, I think 'mostSpecificType'
    // should just be ONE item
    let display = specificTypes.map(type => { 
        let abb = type.split("#")[1] || type
 
        if (abb === type) {
          abb= type.substring(type.lastIndexOf("/") + 1)
        }
           
        return (
            <span className="type-display">
              <i><a href={type} target="_blank">{abb}</a></i>
            </span>
        )
    })
 
    return display
 
  }

  get score() {
    // maybe just two decimal places
    let score = parseFloat(this.doc.score).toFixed(2)
    return score
  }

  get URI() {
    return this.doc.URI
  }

  get highlightText() {

    let display = ""
      if (this.highlight) {
        // NOTE: sometimes doc.type is undefined (strangely enough) 
        let docType = this.doc.type ? this.doc.type[0] : "?"

        // FIXME: might have to look at highlight.nameText too
        // then again, might not -- not sure
        display = this.highlight.duke_text ? this.highlight.duke_text[0] : ""

      } else {
        // no highlight -- not sure what to show
        display = ""
      }

    if (this.filterHighlightText) {
      return this.filterHighlightText(display)
    }

    return display
  }

  get highlightDisplay() {

    let text = this.highlightText

    // NOTE: left this in place as a hook for a replace text function to modify what is shown 
    // as 'highlight' text.  It was used for grants (for instance) with text like this:
    // "Continuant Entity Grant Institutional Training Grant Relationship Specifically Dependent Continuant"
    //
    let replacedText = this.filterHighlightText ? this.filterHighlightText(text) : text

    if (text === "") { return "" }

    let fragment = (
        <cite>
          <span>...</span>
          <span dangerouslySetInnerHTML={{__html: replacedText}}></span>
          <span>...</span>
        </cite>
    )

    return fragment

  }

  toggleSolrDetails(e) {
    e.preventDefault()
    let showSolr = this.state ? this.state.showSolr : false
    let toggle = !showSolr
    this.setState({'showSolr': toggle})
  }

  get solrDocDisplay() {
    let env = process.env.NODE_ENV

    if (env == 'production') {
      return (<span></span>)
    }

    let showSolr = this.state ? this.state.showSolr : false

    let fragment = (
       <div className="row solr-doc-details">
        <div className="col-md-12"><a href="#" onClick={(e) => this.toggleSolrDetails(e)}><span className="glyphicon glyphicon-option-horizontal"></span></a>
          <pre className={showSolr ? '' : 'hidden'}>
            {JSON.stringify(this.doc, null, 2)}
          </pre>
        </div>
      </div>
    )

    return fragment
  }

  get allTextDisplay() {
    let fragment = (
      <div className="row">
        <div className="col-md-12">
          <div className="alert alert-success"><strong>ALLTEXT</strong> {this.allText}</div>
        </div>
      </div>
    )

    return fragment
  }

}

export default HasSolrData
