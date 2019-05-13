import { connect } from 'react-redux'
import UserPreferencedCurrencyDisplay from './user-preferenced-currency-display.component'
import { preferencesSelector } from '../../selectors'
import { SWTC, PRIMARY, SECONDARY } from '../../constants/common'

const mapStateToProps = (state, ownProps) => {
  const {
    useNativeCurrencyAsPrimaryCurrency,
   // showFiatInTestnets,
  } = preferencesSelector(state)

 // const isMainnet = getIsMainnet(state)

  return {
    useNativeCurrencyAsPrimaryCurrency,
   // showFiatInTestnets,
  //  isMainnet,
    nativeCurrency: state.metamask.nativeCurrency,
  }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { useNativeCurrencyAsPrimaryCurrency, nativeCurrency, ...restStateProps } = stateProps
  const {
    type,
    numberOfDecimals: propsNumberOfDecimals,
    ethNumberOfDecimals,
    fiatNumberOfDecimals,
    ethPrefix,
    fiatPrefix,
    address,
    prefix: propsPrefix,
    ...restOwnProps
  } = ownProps

  let currency, numberOfDecimals, prefix

  if (type === PRIMARY && useNativeCurrencyAsPrimaryCurrency ||
    type === SECONDARY && !useNativeCurrencyAsPrimaryCurrency) {
    // Display ETH
    currency = nativeCurrency || SWTC
    numberOfDecimals = propsNumberOfDecimals || ethNumberOfDecimals || 6
    prefix = propsPrefix || ethPrefix
  } else if (type === SECONDARY && useNativeCurrencyAsPrimaryCurrency ||
    type === PRIMARY && !useNativeCurrencyAsPrimaryCurrency) {
    // Display Fiat
    numberOfDecimals = propsNumberOfDecimals || fiatNumberOfDecimals || 2
    prefix = propsPrefix || fiatPrefix
  }


  return {
    ...restStateProps,
    ...dispatchProps,
    ...restOwnProps,
    nativeCurrency,
    currency,
    numberOfDecimals,
    prefix,
    address,
  }
}

export default connect(mapStateToProps, null, mergeProps)(UserPreferencedCurrencyDisplay)
