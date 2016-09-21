import _ from 'lodash'

import PeopleTab from './PeopleTab'
import PublicationsTab from './PublicationsTab'
import OrganizationsTab from './OrganizationsTab'
import GenericTab from './GenericTab'
import ArtisticWorksTab from './ArtisticWorksTab'
import SubjectHeadingsTab from './SubjectHeadingsTab'
import GrantsTab from './GrantsTab'
import CoursesTab from './CoursesTab'
import OtherTab from './OtherTab'

export const tabList = [
  { id: "person", clz: PeopleTab, instance: new PeopleTab() },
  { id: "publications",  clz: PublicationsTab, instance: new PublicationsTab() },
  { id: "organizations",  clz: OrganizationsTab, instance: new OrganizationsTab() }, 
  { id: "grants",  clz: GrantsTab, instance: new GrantsTab() }, 
  { id: "courses",  clz: CoursesTab, instance: new CoursesTab() },
  { id: "artisticworks",  clz: ArtisticWorksTab, instance: new ArtisticWorksTab() },
  { id: "subjectheadings", clz: SubjectHeadingsTab, instance: new SubjectHeadingsTab() },
  { id: "misc", clz: OtherTab, instance: new OtherTab() }
]

export function findTab(name) {
  let tab = _.find(tabList, function(tab) { return tab.id == name })
  return tab
}

// NOTE: this is a little fancy, but is a half-way point to declarative tabs
// got idea for dynamic class loading based on string value of name from here:
// http://stackoverflow.com/questions/34655616/create-an-instance-of-a-class-in-es6-with-a-dynamic-name

class TabLoader {
    constructor (name) {
      const tab = findTab(name)
     
      if (tab) {
        return tab.instance
        //return new tab.clz()
     } else {
       return new GenericTab()
     }
  }

}

export default TabLoader

