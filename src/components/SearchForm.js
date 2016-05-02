import React, { Component, PropTypes } from 'react'

import ReactDOM from 'react-dom'

import actions from '../actions/search'

//require('../styles/forms.less');

import SearchResults from './SearchResults'
//
// all words = ( word AND word .. )   
// exact match = " word phrase "
// at least one = ( word OR word ..)
// no match = NOT word
//  NOTE: NOT that is alone returns no results
export class SearchForm extends Component {


  // FIXME: don't necessarily like this down at SearchForm
  // level just to get at router and add values to router
  // so they go into state
  static get contextTypes() {
    return({
        router: PropTypes.object
    })
  }

  constructor(props, context) {
    super(props, context)
    this.handleSubmitSearch = this.handleSubmitSearch.bind(this)
    // NOTE: could do like this too
    //this.handleSubmitSearch = () => this.handleSubmitSearch();
    
    // FIXME: what about if router starts with values already ?
    // need to run that search on init ....
    //
    // context undefined ...
    
    //if (this.context.router.query) {
    //  console.log(`Got query from routes=${this.context.query}`)
    //}


  }

  componentDidMount () {
    console.log(`SearchForm#componentDidMount() query from routes=${this.context.router.query}`)
    console.log(this.context.router)
    
    console.log(this.props)

  }

  handleSubmitSearch(e) {
    e.preventDefault();

    //const { dispatch } = this.props;
    const { search : { start }, dispatch } = this.props;
 
    const allWords = this.allWords
    const exactMatch = this.exactMatch
    const atLeastOne = this.atLeastOne
    const noMatch = this.noMatch

    var add = "";
    if (allWords.value.lastIndexOf('*', 0) != 0) {
     add = "*"
    }
    // NOTE: allWords search is more complicated,
    // needs a '*' possibly after every word ...
    //
    // then add to term + update UI
    // could also just add as event handler
    // to allWords ...
    // default filter to 'person' ?
    const compoundSearch = {
       'allWords': allWords.value,
       'exactMatch': exactMatch.value,
       'atLeastOne': atLeastOne.value,
       'noMatch': noMatch.value,
       'start': start,
       'filter': 'person'
     }

    /*
     * FIXME: should only add these to route if there is a value
     *
     *
     * FIXME: this path should be global, configurable
     */
    this.context.router.push({
      pathname: '/',
      query: compoundSearch 
    })

    dispatch(actions.resetPage())
    
    // reset filter? to person --
    dispatch(actions.resetFilter())

    // FIXME: is this going to work???
    //
    // why is this not updating state ... ???
    dispatch(actions.fetchTabCounts(compoundSearch))

    dispatch(actions.fetchSearch(compoundSearch, start))

    // FIXME: would be cool if it were just a function call
    //actions.fetchSearch(compoundSearch, 0)
    // instead of 'dispatch' --
    // 'dispatch' is a magic function  
    //  made available when calling 'connect' (see below)
    //
    //  a Component must have render() method (I think) so it's kind of 
    //  more like an interface
 
  }

  render() {
    // FIXME: 'search' seems passed down from 'connect()'
    // not sure why it's empty if I don't connect ... how
    // do 'props' get sent down - if we have to 'connect'
    // everytime, then what's the point of a hierarchy of components? 
    
    // FIXME: more - don't like locationBeforeTransitions at all
    const { search : { isFetching, searchFields }, routing: { locationBeforeTransitions } } = this.props;

    console.log(`SearchForm#render()****`)
    console.log(locationBeforeTransitions)

    // FIXME: this seems way wrong
    let query = locationBeforeTransitions.query

    const allWords = query.allWords
    const exactMatch = query.exactMatch
    const atLeastOne = query.atLeastOne
    const noMatch = query.noMatch

    // if something is defined here - run the search ???
    //

    // FIXME: probably better way to do this
    let button
    if (isFetching) {
         button = <button type="submit" className="btn btn-primary" disabled>Submit</button>
    } else {
         button = <button type="submit" className="btn btn-primary">Submit</button>
    }
     
     return (

       <section>
        <form onSubmit={this.handleSubmitSearch}>
          <div className="form-group">
            <label>With all these words</label>
            <input type="text" ref={(ref) => this.allWords = ref} defaultValue={allWords} className="form-control"  placeholder="Multiple, Terms, Use, Comma"/>
            </div>
          
          <div className="form-group">
            <label>With the exact phrase</label>
            <input type="text" ref={(ref) => this.exactMatch = ref} defaultValue={exactMatch} className="form-control" placeholder="Exact match"/>
          </div>
           <div className="form-group">
            <label>With at least one of these words</label>
            <input type="text" ref={(ref) => this.atLeastOne = ref} defaultValue={atLeastOne} className="form-control"  placeholder="Multiple, Terms, Use, Comma" />
          </div>

           <div className="form-group">
            <label>With none of these words</label>
            <input type="text" ref={(ref) => this.noMatch = ref} defaultValue={noMatch} className="form-control" placeholder="Multiple, Terms, Use, Comma" />
          </div>
                   
          {button}

        </form>
       
           
        <hr/>
 
      </section>

    )
  }

}

import { connect } from 'react-redux'
// make a function that maps the stores state to the props
// of our top-level component, anything goes here, just return
// and object and use the state as you see fit.
// get greeting from query params now that we have routes
const mapStateToProps = (search, ownProps) => {
  return search
  // FIXME: this says cannot read "property query of undefined"
  //return { ...search,
  //  searchFields: ownProps.location.query
 //  }
}


export default connect(mapStateToProps)(SearchForm);

