// NOTE: had to have this in a separate file so I could import it in babel-node environment
// e.g. in the examples/example_*.js scripts.  
//
// The {!tag=?} part is used to match the id to
// the filter - so they have to match and be there.  Otherwise we have to match on entire
// type:(*?) statement
//
export const tabList = [
  { id: "person", filter: "{!tag=person}type:(*Person)", label: "People" },
  { id: "publications",  filter: "{!tag=publications}type:(*bibo/Document)", label: "Publications" },
  { id: "organizations",  filter: "{!tag=organizations}type:(*Organization)", label: "Organizations" }, 
  { id: "grants",  filter: "{!tag=grants}type:(*Grant)", label: "Grants" }, 
  { id: "courses",  filter: "{!tag=courses}type:(*Course)", label: "Courses" },
  { id: "artisticworks",  filter: "{!tag=artisticworks}type:(*ArtisticWork)", label: "Artistic Works" },
  { id: "subjectheadings", filter: "{!tag=subjectheadings}type:(*Concept)", label: "Subject Headings" },
  { id: "misc",  filter: "{!tag=misc}type:((*Award) OR (*Presentation) OR (*geographical_region) OR (*self_governing))",
   label: "Other"
  }
  /*
  { id: "misc",  filter: "{!tag=misc}type:(NOT((*Person) OR (*bibo/Document) OR (*Organization) OR (*Grant) OR (*Course) OR (*ArtisticWork) OR (*Concept)))",
   label: "Other"
  }
  */
]

