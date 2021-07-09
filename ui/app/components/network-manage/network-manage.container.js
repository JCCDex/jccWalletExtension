import { connect } from 'react-redux'
import { compose } from 'recompose'
import { withRouter } from 'react-router-dom'
const {setNetwork,addNetwork,deleteNetwork,updateNetwork} = require('../../actions')
import NetworkManage from './network-manage.component'

function mapStateToProps (state) {
    const { metamask: {isAccountMenuOpen ,networks,selectedWalletType,selectedNetWork} } = state
    return {
        networks,
        selectedWalletType,
        selectedNetWork
    }
  }

  function mapDispatchToProps (dispatch) {
    return {
        setNetwork:(type,network)=>dispatch(type,setNetwork(network)),
        addNetwork:(network)=>dispatch(addNetwork(network)),
        deleteNetwork:(network)=>dispatch(deleteNetwork(network)),
        updateNetwork:(network)=>dispatch(updateNetwork(network))
    }
  }

export default compose(
    withRouter,
    connect(mapStateToProps,mapDispatchToProps)
)(NetworkManage)    