import { connect } from 'react-redux'
import CurrencyInput from './currency-input.component'
import { SWTC } from '../../constants/common'


const mapStateToProps = state => {
  const { metamask: { nativeCurrency, currentCurrency, conversionRate } } = state


  return {
    nativeCurrency,
    currentCurrency,
    conversionRate,

  }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { nativeCurrency } = stateProps

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    nativeSuffix: nativeCurrency,
  }
}

export default connect(mapStateToProps, null, mergeProps)(CurrencyInput)
