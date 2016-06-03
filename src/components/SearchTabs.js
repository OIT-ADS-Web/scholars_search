import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import actions from '../actions/search'
import solr from '../utils/SolrHelpers'

import SearchTab from './SearchTab'

export class SearchTabs extends Component {

  constructor(props) {
    super(props)
  }


  // FIXME: should there be a -- next tab
  // e.g.
  /*
  handleNextTab(e) {
    e.preventDefault()
    
    const { search : { results, searchFields }, dispatch } = this.props

    //let filter = next -> filter

    // setting default start to 0 - so paging is reset - luckily
    // filter should always be present
    const query  = {...searchFields, start: 0, filter: filter }

    dispatch(requestSearch(query))
    
    // NOTE: took me a while to figure out I couldn't just pass
    // searchFields as {query: searchFields} had to copy it (see above)
    this.context.router.push({
      pathname: '/',
      query: query
    })

  }
  */

  render() {
     const { search : {searchFields} } = this.props
 
     // FIXME: seems like I shouldn't default filter in this place - 
     // e.g. it should be more global
     let filter = searchFields ? searchFields['filter'] : 'person'

     const { tabs : {grouped, isFetching } } = this.props

     const tabList = solr.tabList

     // note: every group has this - we only need one though
     var ungroupedCount = 0
    
     // matches - gives total matches ---
     //
     // NOTE: made it into an array so order would be preserved
     let tabs = _.map(tabList, (tab) => {
      
      // if we're still fetching - there will be nothing in 'grouped' to pull counts from
      if (isFetching) {
        return <div></div>
      }

      // get the count - default to 0 just in case something wrong
      //let matches = 0

      let matches = tab.filter in grouped ? grouped[tab.filter].matches : 0
      let count = tab.filter in grouped ? grouped[tab.filter].doclist.numFound : 0
      let label = tab.label
      
      ungroupedCount = matches

      return <SearchTab key={tab.id} filter={tab.id} active={filter == tab.id} label={tab.label} count={count} matches={matches}/>

    })

    // FIXME: not crazy about this - this is basically just different tabs for mobile
    //
    let figureCurrentTab = () => {

      if (isFetching) {
         return <div></div>
       }
      
       let tab = _.find(tabList, { id: filter})

       let matches = tab.filter in grouped ? grouped[tab.filter].matches : 0
       let count = tab.filter in grouped ? grouped[tab.filter].doclist.numFound : 0
       let label = tab.label

        //     <SearchTab key={tab.id} filter={tab.id} active={true} label={tab.label} count={count} matches={matches}/>
       // FIXME: need a link to the next tab ?  right ? 
       return (
           <li className="active"><a>{tab.label} ({count})</a></li>
       )
    }

    let currentTab = figureCurrentTab()

    return (
        <div>
          <h4>Total Found: {ungroupedCount}</h4>
          
          <nav className="visible-xs">

            <ul className="nav nav-pills">
               {currentTab}
            </ul>
          </nav>

          <nav className="hidden-xs">
            <ul className="nav nav-pills nav-justified">
              {tabs}
            </ul>
 
          </nav>

        </div>

      )
  }

}

const mapStateToProps = (tabs) => {
  return tabs
}


export default connect(mapStateToProps)(SearchTabs)

