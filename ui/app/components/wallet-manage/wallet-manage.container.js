import { compose } from 'recompose'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import WalletManage  from './wallet-manage.component'
const selectors = require('../../selectors')
const actions = require('../../actions')
  const mapStateToProps = state => {

    return {
      identities: state.metamask.identities,
      accounts: selectors.getMetaMaskAccounts(state),
      selectedTokenAddress: state.metamask.selectedTokenAddress,
      manageWalletAddress:state.metamask.manageWalletAddress,
      manageWalletType:state.metamask.manageWalletType,
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
      getSecret:(address,secret)=>dispatch(actions.getSecret(address,secret))
    }
  }
  
export default compose(
  withRouter,
  connect(mapStateToProps,mapDispatchToProps)
)(WalletManage)