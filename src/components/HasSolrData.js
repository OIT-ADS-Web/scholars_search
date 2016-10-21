import React from 'react'

// NOTE: one way to do this, not the only way
// http://exploringjs.com/es6/ch_classes.html
// http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/

// NOTE: have to assume we are getting 'doc' and 'highlight' props
let HasSolrData = (superclass) => class extends superclass {

  f(str) {
    return (str || "").replace(/&#039;/g,"'");
  }

  get name() {
    let nameRaw = this.doc.nameRaw || [""]
    return nameRaw[0]
  }

  get preferredTitle() {
    return this.doc.PREFERRED_TITLE
  }

  get doc() {
    let doc = this.props.doc
    return doc
  }

  get highlight() {
    let highlight = this.props.highlight
    return highlight
  }


  get docId() {
    return this.doc.DocId
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
    
    // FIXME: despite the data types, I think 'mostSpecificType'
    // should just be ONE item
    let display = specificTypes.map(type => { 
        let abb = type.split("#")[1] || type
 
        if (abb === type) {
          abb= type.substring(type.lastIndexOf("/") + 1)
        }
 
        abb = abb.replace(/([A-Z])/g, ' $1') // NOTE: changes "AcademicDepartment" to "Academic Department"
         
        let type_display = `${type}_display`

        return (
            <span key={type_display} className="type-display">
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

  // http://stackoverflow.com/questions/10026626/check-if-html-snippet-is-valid-with-javascript
  // was getting some malformed html <font >... <b> ... stuff 
  // (see Reddy, William M) https://scholars2-test.oit.duke.edu/person/wmr
  //
  tidy(html) {
    let d = document.createElement('div')
    d.innerHTML = html
    return d.innerHTML
  }
 
  get highlightDisplay() {
  
    let text = this.highlightText

    // NOTE: left this in place as a hook for a replace text function to modify what is shown 
    // as 'highlight' text.  It was used for grants (for instance) with text like this:
    // "Continuant Entity Grant Institutional Training Grant Relationship Specifically Dependent Continuant"
    //
    let replacedText = this.filterHighlightText ? this.filterHighlightText(text) : text

    if (text === "") { return "" }
    
    replacedText = this.tidy(replacedText)

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

    // NOTE: so we're not showing this except in development
    // it's just a view of the SOLR doc for debugging purposes
    if (env == '_production') {
    //if (env == 'production' || env == 'acceptance') {
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
