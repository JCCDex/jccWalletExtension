

import { compose } from 'recompose'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import WalletView  from './wallet-view.component'
const selectors = require('../../selectors')
const actions = require('../../actions')
  const mapStateToProps = state => {

    return {
      sidebarOpen: state.appState.sidebar.isOpen,
      identities: state.metamask.identities,
      accounts: selectors.getMetaMaskAccounts(state),
      keyrings: state.metamask.keyrings,
      selectedAddress: selectors.getSelectedAddress(state),
      selectedAccount: selectors.getSelectedAccount(state),
      selectedTokenAddress: state.metamask.selectedTokenAddress,
      wallets : state.metamask.wallets,
      ChainTypeList : state.metamask.ChainTypeList,
      selectedWalletType :  state.metamask.selectedWalletType,
      selectedIdentity: selectors.getSelectedIdentity(state),
    }
  }
  
  const mapDispatchToProps = dispatch => {
    return {
      showSendPage: () => dispatch(actions.showSendPage()),
      hideSidebar: () => dispatch(actions.hideSidebar()),
      unsetSelectedToken: () => dispatch(actions.setSelectedToken()),
      setSelectedWalletType:(type)=>dispatch(actions.setSelectedWalletType(type)),
      showAccountDetailModal: () => {
        dispatch(actions.showModal({ name: 'ACCOUNT_DETAILS' }))
      },
     
    }
  }


export default compose(
  withRouter,
  connect(mapStateToProps,mapDispatchToProps)
)(WalletView)
  