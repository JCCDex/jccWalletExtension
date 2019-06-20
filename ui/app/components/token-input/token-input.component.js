import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import UnitInput from '../unit-input'
import CurrencyDisplay from '../currency-display'
import { conversionUtil, multiplyCurrencies } from '../../conversion-util'
import { SWTC } from '../../constants/common'

/**
 * Component that allows user to enter token values as a number, and props receive a converted
 * hex value. props.value, used as a default or forced value, should be a hex value, which
 * gets converted into a decimal value.
 */
export default class TokenInput extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
  }

  static propTypes = {
    currentCurrency: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    value: PropTypes.string,
    suffix: PropTypes.string,
    hideConversion: PropTypes.bool,
    selectedToken: PropTypes.object,
    selectedTokenExchangeRate: PropTypes.number,
  }

  constructor (props) {
    super(props)

    const { value: hexValue } = props
    const decimalValue = hexValue ? this.getValue(props) : 0

    this.state = {
      decimalValue,
      hexValue,
    }
  }


  handleChange = decimalValue => {
    const { selectedToken: { decimals } = {}, onChange } = this.props

    const multiplier = Math.pow(10, Number(decimals || 0))
    const hexValue = multiplyCurrencies(decimalValue || 0, multiplier, { toNumericBase: 'hex' })

    this.setState({ hexValue, decimalValue })
    onChange(hexValue)
  }

  handleBlur = () => {
    this.props.onBlur(this.state.hexValue)
  }

  renderConversionComponent () {
    const { selectedTokenExchangeRate, currentCurrency, hideConversion } = this.props
    const { decimalValue } = this.state
    let currency, numberOfDecimals

    if (hideConversion) {
      return (
        <div className="currency-input__conversion-component">
          { this.context.t('noConversionRateAvailable') }
        </div>
      )
    }

   
      // Display SWTC
      currency = SWTC
      numberOfDecimals = 6
    

    return selectedTokenExchangeRate
      ? (
        <CurrencyDisplay
          className="currency-input__conversion-component"
          currency={currency}
          value={hexWeiValue}
          numberOfDecimals={numberOfDecimals}
        />
      ) : (
        <div className="currency-input__conversion-component">
          { this.context.t('noConversionRateAvailable') }
        </div>
      )
  }

  render () {
    const { suffix, ...restProps } = this.props
    const { decimalValue } = this.state

    return (
      <UnitInput
        {...restProps}
        suffix={suffix}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        value={decimalValue}
      >
        { this.renderConversionComponent() }
      </UnitInput>
    )
  }
}
