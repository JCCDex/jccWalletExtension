import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import TransactionViewBalance from './transaction-view-balance.component'
import {
  getSelectedToken,
  getSelectedAddress,
  getNativeCurrency,
  getSelectedTokenAssetImage,
  getMetaMaskAccounts,
 // isBalanceCached,
} from '../../selectors'
import { showModal } from '../../actions'

const mapStateToProps = state => {
  const selectedAddress = getSelectedAddress(state)
  const accounts = getMetaMaskAccounts(state)
  const account = accounts[selectedAddress]
  const { balance } = account
 

  return {
    selectedToken: getSelectedToken(state),
    balance,
    nativeCurrency: getNativeCurrency(state),
    assetImage: getSelectedTokenAssetImage(state),
  //  balanceIsCached: isBalanceCached(state),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    showDepositModal: () => dispatch(showModal({ name: 'DEPOSIT_ETHER' })),
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(TransactionViewBalance)
