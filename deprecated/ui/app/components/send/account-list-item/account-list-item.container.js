import { connect } from 'react-redux'
import {
    getConversionRate,
    getCurrentCurrency,
    getNativeCurrency,
} from '../send.selectors.js'

import AccountListItem from './account-list-item.component'

export default connect(mapStateToProps)(AccountListItem)

function mapStateToProps (state) {
 // const { showFiatInTestnets } = preferencesSelector(state)
 // const isMainnet = getIsMainnet(state)

  return {
    conversionRate: getConversionRate(state),
    currentCurrency: getCurrentCurrency(state),
    nativeCurrency: getNativeCurrency(state),
 //   showFiat: (isMainnet || !!showFiatInTestnets),
  }
}
