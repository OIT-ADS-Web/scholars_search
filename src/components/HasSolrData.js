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

  get mostSpecificType() {
    // NOTE: sometimes it's just blank, for some reason
    let specificTypes = this.doc.mostSpecificTypeURIs || []
    return specificTypes.join(" ")
  }

  get score() {
    // maybe just two decimal places
    let score = parseFloat(this.doc.score).toFixed(2)
    console.log(score)
    return score
  }


}

export default HasSolrData

