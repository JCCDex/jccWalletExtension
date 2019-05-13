import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import UnitInput from '../unit-input'
import CurrencyDisplay from '../currency-display'
import { getValueFromWeiHex, getWeiHexFromDecimalValue } from '../../helpers/conversions.util'
import { SWTC } from '../../constants/common'

/**
 * Component that allows user to enter currency values as a number, and props receive a converted
 * hex value in WEI. props.value, used as a default or forced value, should be a hex value, which
 * gets converted into a decimal value depending on the currency (ETH or Fiat).
 */
export default class CurrencyInput extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
  }

  static propTypes = {
    conversionRate: PropTypes.number,
    currentCurrency: PropTypes.string,
    nativeCurrency: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    useFiat: PropTypes.bool,
    hideFiat: PropTypes.bool,
    value: PropTypes.string,
    fiatSuffix: PropTypes.string,
    nativeSuffix: PropTypes.string,
  }

  constructor (props) {
    super(props)

    const { value: hexValue } = props
    const decimalValue = hexValue ? this.getDecimalValue(props) : 0

    this.state = {
      decimalValue,
      hexValue,
      isSwapped: false,
    }
  }

  componentDidUpdate (prevProps) {
    const { value: prevPropsHexValue } = prevProps
    const { value: propsHexValue } = this.props
    const { hexValue: stateHexValue } = this.state

    if (prevPropsHexValue !== propsHexValue && propsHexValue !== stateHexValue) {
      const decimalValue = this.getDecimalValue(this.props)
      this.setState({ hexValue: propsHexValue, decimalValue })
    }
  }

  getDecimalValue (props) {
    const { value: hexValue } = props
    const decimalValueString = hexValue
     
    return Number(decimalValueString) || 0
  }

  shouldUseFiat = () => {
    const { useFiat, hideFiat } = this.props
    const { isSwapped } = this.state || {}

    if (hideFiat) {
      return false
    }

    return isSwapped ? !useFiat : useFiat
  }

  swap = () => {
    const { isSwapped, decimalValue } = this.state
    this.setState({isSwapped: !isSwapped}, () => {
      this.handleChange(decimalValue)
    })
  }

  handleChange = decimalValue => {
    const { onChange } = this.props

    const hexValue = decimalValue

    this.setState({ hexValue, decimalValue })
    onChange(hexValue)
  }

  handleBlur = () => {
    this.props.onBlur(this.state.hexValue)
  }

  renderConversionComponent () {
    const { nativeCurrency, hideFiat } = this.props
    const { hexValue } = this.state
    let currency, numberOfDecimals

    if (hideFiat) {
      return (
        <div className="currency-input__conversion-component">
          { this.context.t('noConversionRateAvailable') }
        </div>
      )
    }
    currency = nativeCurrency
    numberOfDecimals = 6


    return (
      <CurrencyDisplay
        className="currency-input__conversion-component"
        currency={currency}
        value={hexValue}
        numberOfDecimals={numberOfDecimals}
      />
    )
  }

  render () {
    const { fiatSuffix, nativeSuffix, ...restProps } = this.props
    const { decimalValue } = this.state

    return (
        <UnitInput
          {...restProps}
          suffix={this.shouldUseFiat() ? fiatSuffix : nativeSuffix}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          value={decimalValue}
        >
          { this.renderConversionComponent() }
        </UnitInput>
    )
  }
}
