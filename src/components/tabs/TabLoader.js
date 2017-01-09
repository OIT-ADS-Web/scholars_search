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
  { id: "person", instance: new PeopleTab() },
  { id: "publications",  instance: new PublicationsTab() },
  // NOTE: took away organizations tab for the time being
  // since 'type' in vivo/index does not match 'type' envisioned
  // (so faceting on 'type' is not useful) 
  //{ id: "organizations",  instance: new OrganizationsTab() }, 
  { id: "grants",  instance: new GrantsTab() }, 
  { id: "courses",  instance: new CoursesTab() },
  { id: "artisticworks",  instance: new ArtisticWorksTab() },
  { id: "subjectheadings", instance: new SubjectHeadingsTab() },
  { id: "misc", instance: new OtherTab() }
]

export function findTab(name) {
  let tab = _.find(tabList, function(tab) { return tab.id == name })
  return tab
}

class TabLoader {
    constructor (name) {
      const tab = findTab(name)
     
      if (tab) {
        return tab.instance
     } else {
       return new GenericTab()
     }
  }

}

export default TabLoader

