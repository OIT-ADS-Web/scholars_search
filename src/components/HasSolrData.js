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

  get types() {
    let typeList = this.doc.type || []
    return typeList.join("<br/>")
  }

  get mostSpecificType() {
    // NOTE: sometimes it's just blank, for some reason
    let specificTypes = this.doc.mostSpecificTypeURIs || []
    return specificTypes.join(" ")
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
        // NOTE: sometimes doc.type is undefined ... ??
        let docType = this.doc.type ? this.doc.type[0] : "?"

        // FIXME: might have to look at highlight.nameText too 
        // then again, it might not -- not sure
        //
        display = this.highlight.ALLTEXT ? this.highlight.ALLTEXT[0] : docType
      } else {
        // no highlight -- not sure what to show
        display = ""
      }

    return display
  }

  get highlightDisplay() {
   
    let text = this.highlightText

    let fragment = ( 
        <cite>
          <span>...</span>
          <span dangerouslySetInnerHTML={{__html: text}}></span>
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

