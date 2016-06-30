import React from 'react'

// NOTE: one way to do this, not the only way
// http://exploringjs.com/es6/ch_classes.html
// http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
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

  highlightText(display) {
    // FIXME: need to factor this out since it's in every 'Display'
    
    let fragment = ( 
        <cite>
          <span>...</span>
          <span dangerouslySetInnerHTML={{__html: display}}></span>
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
    //const env = process.env
    // if env == 'acceptance' 
    // else
    // fragment = (<div></div>)
 
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

