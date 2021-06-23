import { connect } from 'react-redux'
import { compose } from 'recompose'
import { withRouter } from 'react-router-dom'
const actions = require('../../actions')
import NetworkMenu from './network-menu.component'

function mapStateToProps (state) {
    const { metamask: { isWalletTypeMenuOpen,isNetworkMenuOpen,isAccountMenuOpen ,Networks,selectedWalletType,selectedNetWork} } = state
    return {
        isWalletTypeMenuOpen,
        isNetworkMenuOpen,
        isAccountMenuOpen,
        Networks,
        selectedWalletType,
        selectedNetWork
    }
  }

  function mapDispatchToProps (dispatch) {
    return {
        updateNetWork:() => dispatch(actions.updateNetWork(url)),
        toggleAccountMenu: () => dispatch(actions.toggleAccountMenu()),
        toggleNetworkMenu: () => dispatch(actions.toggleNetworkMenu()),
        toggleWalletTypeMenu: () => dispatch(actions.toggleWalletTypeMenu()),
    }
  }

export default compose(
    withRouter,
    connect(mapStateToProps,mapDispatchToProps)
)(NetworkMenu)    