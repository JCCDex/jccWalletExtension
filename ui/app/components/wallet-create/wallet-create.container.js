import { connect } from 'react-redux'
import { compose } from 'recompose'
import { withRouter } from 'react-router-dom'
import WalletCreateSelect from './wallet-create.component'
import action from '../../actions'

const mapStateToProps = (state) => {
  return {
    manageWalletType:state.metamask.manageWalletType,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setManageWalletType:(type)=>dispatch(actions.setManageWalletType(type)),
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(WalletCreateSelect)