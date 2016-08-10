
export const tabList = [
  { id: "person", filter: "{!tag=person}type:(*Person)", label: "People" },
  { id: "publications",  filter: "{!tag=publications}type:(*bibo/Document)", label: "Publications" },
  { id: "organizations",  filter: "{!tag=organizations}type:(*Organization)", label: "Organizations" }, 
  { id: "grants",  filter: "{!tag=grants}type:(*Grant)", label: "Grants" }, 
  { id: "courses",  filter: "{!tag=courses}type:(*Course)", label: "Courses" },
  { id: "artisticworks",  filter: "{!tag=artisticworks}type:(*ArtisticWork)", label: "Artistic Works" },
  { id: "subjectheadings", filter: "{!tag=subjectheadings}type:(*Concept)", label: "Subject Headings" },
  { id: "misc",  filter: "{!tag=misc}type:(NOT((*Person) OR (*bibo/Document) OR (*Organization) OR (*Grant) OR (*Course) OR (*ArtisticWork) OR (*Concept)))",
   label: "Other"
  }
]


