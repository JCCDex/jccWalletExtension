import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { removeLeadingZeroes } from '../send/send.utils'

/**
 * Component that attaches a suffix or unit of measurement trailing user input, ex. 'ETH'. Also
 * allows rendering a child component underneath the input to, for example, display conversions of
 * the shown suffix.
 */
export default class UnitInput extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    actionComponent: PropTypes.node,
    error: PropTypes.bool,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    suffix: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }

  static defaultProps = {
    placeholder: '0',
  }

  constructor (props) {
    super(props)

    this.state = {
      value: props.value || '',
    }
  }

  componentDidUpdate (prevProps) {
    const { value: prevPropsValue } = prevProps
    const { value: propsValue } = this.props
    const { value: stateValue } = this.state

    if (prevPropsValue !== propsValue && propsValue !== stateValue) {
      this.setState({ value: propsValue })
    }
  }

  handleFocus = () => {
    this.unitInput.focus()
  }

  handleChange = event => {
    const { value: userInput } = event.target
    let value = userInput
    if (userInput.length && userInput.length > 1) {
      value = removeLeadingZeroes(userInput)
    }

    this.setState({ value })
    this.props.onChange(value)
  }

  handleBlur = event => {
    const { onBlur } = this.props
    typeof onBlur === 'function' && onBlur(this.state.value)
  }

  getInputWidth (value) {
    const valueString = String(value)
    const valueLength = valueString.length || 1
    const decimalPointDeficit = valueString.match(/\./) ? -0.5 : 0
    return (valueLength + decimalPointDeficit + 0.5) + 'ch'
  }

  render () {
    const { error, placeholder, suffix, actionComponent, children } = this.props
    const { value } = this.state

    return (
      <div
      style={{width:"255px", height:"32px"}}
        //className={classnames('unit-input', { 'unit-input--error': error })}
        onClick={this.handleFocus}
      >
        <div className="unit-input__inputs">
          <div className="unit-input__input-container">
            <input
              type="number"
              style={{width:"255px", height:"32px"}}
              //className="unit-input__input"
              value={value}
              placeholder={placeholder}
              onChange={this.handleChange}
              onBlur={this.handleBlur}
             // style={{ width: this.getInputWidth(value) }}
              ref={ref => { this.unitInput = ref }}
            />
            
          </div>
        </div>
        {actionComponent}
      </div>
    )
  }
}
