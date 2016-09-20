import GenericTab from './GenericTab'

class OtherTab extends GenericTab {

  constructor() {

    super()

    this.id =  "misc"
    this.filter =  "{!tag=misc}type:((*Award) OR (*Presentation) OR (*geographical_region) OR (*self_governing))"
    //this.filter = "{!tag=misc}type:(NOT((*Person) OR (*bibo/Document) OR (*Organization) OR (*Grant) OR (*Course) OR (*ArtisticWork) OR (*Concept)))"
 
    this.label =  "Other"

  }
 
}


export default OtherTab 
