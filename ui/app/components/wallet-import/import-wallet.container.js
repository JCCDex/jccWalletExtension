import { connect } from 'react-redux'
import { compose } from 'recompose'
import { withRouter } from 'react-router-dom'
import ImportAccount from './import-wallet.component'
import action from '../../actions'

const mapStateToProps = ({ metamask }) => {
  const { importMode ,manageWalletType} = metamask
  return {
    importMode,
    manageWalletType
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setImportAccountMode: (type) => dispatch(action.setImportAccountMode(type)),
    setCompletedOnboarding: () => dispatch(action.setCompletedOnboarding()),
    setAccountLabel: (type,account, label) => {
      dispatch(action.setAccountLabel(type,account, label))
    },
    getAddressByType:(secret,type)=>dispatch(action.getAddressByType(secret,type)),
    setSelectedAddress:(address)=>dispatch(action.setSelectedAddress(address)),
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(ImportAccount)