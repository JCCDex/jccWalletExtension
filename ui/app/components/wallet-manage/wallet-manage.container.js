import { compose } from 'recompose'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import WalletManage  from './wallet-manage.component'
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

    }
  }
  
  const mapDispatchToProps = dispatch => {
    return {
      showSendPage: () => dispatch(actions.showSendPage()),
      hideSidebar: () => dispatch(actions.hideSidebar()),
      unsetSelectedToken: () => dispatch(actions.setSelectedToken()),
      showAccountDetailModal: () => {
        dispatch(actions.showModal({ name: 'ACCOUNT_DETAILS' }))
      },
      //
      getWalletsByType:(type)=> dispatch(actions.getWalletsByType(type)),
      //设置 默认帐号的行为
      setDefaultAccount:(type,address)=> dispatch(actions.setDefaultAccount(type,address)),
      setCurrentWallet:(wallet)=>dispatch(actions.setCurrentWallet(wallet)),

    }
  }


export default compose(
  withRouter,
  connect(mapStateToProps,mapDispatchToProps)
)(WalletManage)