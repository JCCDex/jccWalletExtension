import { connect } from 'react-redux'
import CurrencyDisplay from './currency-display.component'

const mapStateToProps = state => {
  const { metamask: { nativeCurrency, currentCurrency, conversionRate } } = state

  return {
    currentCurrency,
    conversionRate,
    nativeCurrency,
  }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { nativeCurrency, currentCurrency, conversionRate, ...restStateProps } = stateProps
  const {
    value,
    numberOfDecimals = 2,
    currency,
    denomination,
    address,
    hideLabel,
    displayValue: propsDisplayValue,
    suffix: propsSuffix,
    ...restOwnProps
  } = ownProps

 // const toCurrency = currency || currentCurrency
 const toCurrency = 'swtc'
  const displayValue = propsDisplayValue || value
  const suffix = propsSuffix || (hideLabel ? undefined : toCurrency.toUpperCase())

  return {
    ...restStateProps,
    ...dispatchProps,
    ...restOwnProps,
    displayValue,
    suffix,
    address,
  }
}

export default connect(mapStateToProps, null, mergeProps)(CurrencyDisplay)
