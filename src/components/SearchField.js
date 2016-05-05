import React, { Component, PropTypes } from 'react'

import ReactDOM from 'react-dom'

export default class SearchField extends Component {

  constructor(props) {
    super(props)
    this.shouldSetInputTextToDefaultValue = this.shouldSetInputTextToDefaultValue.bind(this)
  }

  // NOTE: jeeesh, this was convoluted and took a while to figure out (see below)
  // https://discuss.reactjs.org/t/how-to-pass-in-initial-value-to-form-fields/869/5
  shouldSetInputTextToDefaultValue (props) {
    let result = (this.previousDefaultValue != props.defaultValue) || (this.previousChangeIndicator != props.changeIndicator)
    return result
  }

  componentWillUpdate (nextProps, nextState) {
    let defaultText = nextProps.defaultValue
    let changeIndicator = nextProps.changeIndicator
      
    if (this.shouldSetInputTextToDefaultValue(nextProps))  {
      // set the default text input value if either the defaultText or the changeIndicator change 
      // set the default value
      var theInput = this.refs.myInput
      theInput.value = defaultText

      // save the default value and change indicator for later comparison
      this.previousDefaultText = defaultText
      this.previousChangeIndicator = changeIndicator
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    return this.shouldSetInputTextToDefaultValue(nextProps)
  }


  // NOTE: ends up being a wrapper for typical input.value access
  // for a text input field - but in this case it's a <SearchField> component
  //
  get value() {
    const input = this.refs.myInput
    const inputValue = input.value
    return inputValue
  }

  handleBlur(e) {
    // FIXME: getting error "cannot read property 'setState' of null"
    
    if(this) {
      this.setState({value: e.target.value})
     }
  }

  render() {
    const { label, placeholder, defaultValue} = this.props

    return (
         <div className="form-group">
          <label>{label}</label>
            <input onBlur = {this.handleBlur} type="text" ref="myInput" className="form-control"  placeholder={placeholder}/>
          </div>
    )

  }

}


