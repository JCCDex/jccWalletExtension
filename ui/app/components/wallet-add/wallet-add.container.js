import { connect } from 'react-redux'
import { compose } from 'recompose'
import { withRouter } from 'react-router-dom'
import WalletAdd from './wallet-add.component'
const actions = require('../../actions')

const mapStateToProps = (state) => {

  return {
    manageWalletType :  state.metamask.manageWalletType,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createWalletByType: (type) => dispatch(actions.createWalletByType(type)),
    setSelectedAddress:(address)=>dispatch(actions.setSelectedAddress(address)),
    setAccountLabel: (type,account, label) => {
      dispatch(actions.setAccountLabel(type,account, label))
    },
    createNewAccount: (type,password,keypair) => dispatch(actions.createNewAccount(type,password,keypair)),
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(WalletAdd)