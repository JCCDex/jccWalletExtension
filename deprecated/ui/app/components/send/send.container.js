import { connect } from 'react-redux'
import SendEther from './send.component'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import {
  getAmountConversionRate,
  getConversionRate,
  getPrimaryCurrency,
  getRecentBlocks,
  getSelectedAddress,
  getSelectedToken,
  getSendAmount,
  getSendEditingTransactionId,
  getSendHexDataFeatureFlagState,
  getSendFromObject,
  getSendTo,
  getTokenBalance,
  getQrCodeData,
} from './send.selectors'
import {
  updateSendTo,
  updateSendTokenBalance,
  showQrScanner,
  qrCodeDetected,
} from '../../actions'
import {
  resetSendState,
  updateSendErrors,
} from '../../ducks/send.duck'
import {
  SEND_ROUTE,
} from '../../routes'

module.exports = compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(SendEther)

function mapStateToProps (state) {
  return {
    amount: getSendAmount(state),
    amountConversionRate: getAmountConversionRate(state),
    conversionRate: getConversionRate(state),
    editingTransactionId: getSendEditingTransactionId(state),
    from: getSendFromObject(state),
    primaryCurrency: getPrimaryCurrency(state),
    recentBlocks: getRecentBlocks(state),
    selectedAddress: getSelectedAddress(state),
    selectedToken: getSelectedToken(state),
    showHexData: getSendHexDataFeatureFlagState(state),
    to: getSendTo(state),
    tokenBalance: getTokenBalance(state),
    qrCodeData: getQrCodeData(state),
    warning: state.appState.warning,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    updateSendTokenBalance: ({ selectedToken, tokenContract, address }) => {
      dispatch(updateSendTokenBalance({
        selectedToken,
        address,
      }))
    },
    updateSendErrors: newError => dispatch(updateSendErrors(newError)),
    resetSendState: () => dispatch(resetSendState()),
    scanQrCode: () => dispatch(showQrScanner(SEND_ROUTE)),
    qrCodeDetected: (data) => dispatch(qrCodeDetected(data)),
    updateSendTo: (to, nickname) => dispatch(updateSendTo(to, nickname)),
  }
}
