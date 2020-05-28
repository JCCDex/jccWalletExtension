import { connect } from 'react-redux'
import SendCurrencyRow from './send-currency-row.component'
const selectors = require('../../../../selectors')
import {
  getSendCur,
} from '../../send.selectors'
import {
  updateSendCurrency,
} from '../../../../actions'

export default connect(mapStateToProps, mapDispatchToProps)(SendCurrencyRow)

function mapStateToProps (state) {
  return {
    sendCur: getSendCur(state),
    accountsTokenBal: selectors.getSelectedAddressTokens(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    updateSendCurrency: sendCur => dispatch(updateSendCurrency(sendCur)),
  }
}