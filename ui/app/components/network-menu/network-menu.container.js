import { connect } from 'react-redux'
import { compose } from 'recompose'
import { withRouter } from 'react-router-dom'
const {setNetwork,toggleWalletTypeMenu,toggleNetworkMenu,toggleAccountMenu,updateNetWork} = require('../../actions')
import NetworkMenu from './network-menu.component'

function mapStateToProps (state) {
    const { metamask: { isWalletTypeMenuOpen,isNetworkMenuOpen,isAccountMenuOpen ,networks,selectedWalletType,selectedNetWork} } = state
    return {
        isWalletTypeMenuOpen,
        isNetworkMenuOpen,
        isAccountMenuOpen,
        networks,
        selectedWalletType,
        selectedNetWork
    }
  }

  function mapDispatchToProps (dispatch) {
    return {
        updateNetWork:() => dispatch(updateNetWork(url)),
        toggleAccountMenu: () => dispatch(toggleAccountMenu()),
        toggleNetworkMenu: () => dispatch(toggleNetworkMenu()),
        toggleWalletTypeMenu: () => dispatch(toggleWalletTypeMenu()),
        setNetwork:(type,network)=>dispatch(setNetwork(type,network)),
    }
  }

export default compose(
    withRouter,
    connect(mapStateToProps,mapDispatchToProps)
)(NetworkMenu)    