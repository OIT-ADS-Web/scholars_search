// The tabs are these (at the moment):
//
// [People][Publications][Artistic Works][Grants][Subject Headings][Misc]
//
// FIXME: this has solr specific stuff "type:(*Person)" - but is a UI element
// (tabs) so a bit of crossed concerns
export const tabList = [
  { id: "person", filter: "type:(*Person)", label: "People" },
  { id: "publications",  filter: "type:(*bibo/Document)", label: "Publications" },
  { id: "organizations",  filter: "type:(*Organization)", label: "Organizations" }, 
  { id: "grants",  filter: "type:(*Grant)", label: "Grants" }, 
  { id: "courses",  filter: "type:(*Course)", label: "Courses" },
  { id: "artisticworks",  filter: "type:(*ArtisticWork)", label: "Artistic Works" },
  { id: "subjectheadings", filter: "type:(*Concept)", label: "Subject Headings" },
  { id: "misc",  filter: "type:(NOT((*Person) OR (*bibo/Document) OR (*Organization) OR (*Grant) OR (*Course) OR (*ArtisticWork) OR (*Concept)))",
   label: "Other"
  }
]


