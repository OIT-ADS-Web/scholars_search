// NOTE: had to have this in a separate file so I could import it in babel-node environment
// e.g. in the examples/example_*.js scripts.  
//
// The {!tag=?} part is used to match the id to
// the filter - so they have to match and be there.  Otherwise we have to match on entire
// type:(*?) statement
// 
// I thought it would be cool to have this information automatically loaded from ./tabs/... path
// but it does create problems with the examples/_*.js (which nobody but me is likely to use, ha!)
//
// id, filter, label
//
export const tabList = [
  { id: "person", filter: "{!tag=person}type:(*Person)", label: "People", tabClass: "PeopleTab" },
  { id: "publications",  filter: "{!tag=publications}type:(*bibo/Document)", label: "Publications", tabClass: "PublicationsTab" },
  { id: "organizations",  filter: "{!tag=organizations}type:(*Organization)", label: "Organizations", tabClass: "OrganizationsTab" }, 
  { id: "grants",  filter: "{!tag=grants}type:(*Grant)", label: "Grants", tabClass: "GrantsTab" }, 
  { id: "courses",  filter: "{!tag=courses}type:(*Course)", label: "Courses", tabClass: "CoursesTab" },
  { id: "artisticworks",  filter: "{!tag=artisticworks}type:(*ArtisticWork)", label: "Artistic Works", tabClass: "ArtisticWorksTab" },
  { id: "subjectheadings", filter: "{!tag=subjectheadings}type:(*Concept)", label: "Subject Headings", tabClass: "SubjectHeadingsTab" },
  { id: "misc",  filter: "{!tag=misc}type:((*Award) OR (*Presentation) OR (*geographical_region) OR (*self_governing))",
    label: "Other", tabClass: "OtherTab"
  }
  /*
  { id: "misc",  filter: "{!tag=misc}type:(NOT((*Person) OR (*bibo/Document) OR (*Organization) OR (*Grant) OR (*Course) OR (*ArtisticWork) OR (*Concept)))",
   label: "Other"
  }
  */
]

