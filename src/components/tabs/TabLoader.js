import _ from 'lodash'

import { tabList } from './TabList'

export function findTab(name) {
  let tab = _.find(tabList, function(tab) { return tab.id == name })
  return tab
}

//http://stackoverflow.com/questions/34655616/create-an-instance-of-a-class-in-es6-with-a-dynamic-name
import PeopleTab from './PeopleTab'
import PublicationsTab from './PublicationsTab'
import OrganizationsTab from './OrganizationsTab'
import GenericTab from './GenericTab'
import ArtisticWorksTab from './ArtisticWorksTab'
import SubjectHeadingsTab from './SubjectHeadingsTab'
import GrantsTab from './GrantsTab'
import CoursesTab from './CoursesTab'
import OtherTab from './OtherTab'

//http://stackoverflow.com/questions/34655616/create-an-instance-of-a-class-in-es6-with-a-dynamic-name
const tabClasses = {
    PeopleTab,
    PublicationsTab,
    OrganizationsTab,
    GenericTab,
    ArtisticWorksTab,
    SubjectHeadingsTab,
    GrantsTab,
    CoursesTab,
    OtherTab,
}

// NOTE: this is a little fancy, but is a half-way point to declarative tabs
class TabRouter {
    constructor (name) {
      const tab = findTab(name)

     if (tab) {
        let tabClass = tab.tabClass
        let opts = tab
        return new tabClasses[tabClass](opts)
     } else {
       return new GenericTab({})
     }
  }

}

export default TabRouter

