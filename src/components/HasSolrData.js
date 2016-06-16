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

  // FIXME: show there maybe be an empty, interface like csv_template? or
  // even not empty
  //
  // 
// get csvTemplates() {
  //   // ideally these would be pre-compiled, not compiled
  //   // on function call - maybe init hook? compileTemplates?
  //   let header = _.template('hello <%= docId %>!')
  //   let body = _.template('hello <%= docId %>!')
  //   return {header: header, body: body}
  // }
  highlightText(display) {

    // FIXME: need to factor this out since it's in every 'Display'
    // but putting {this.highlightText} - or even just calling highlightText() in
    // render() is crashing the entire application now
    
    let fragment = <cite><span>...</span>
          <span dangerouslySetInnerHTML={{__html: display}}></span>
          <span>...</span>
        </cite>
    
    return fragment

  }

}

export default HasSolrData

