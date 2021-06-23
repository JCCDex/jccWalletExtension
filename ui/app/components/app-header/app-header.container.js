import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'

import AppHeader from './app-header.component'
const actions = require('../../actions')

const mapStateToProps = state => {
  const { metamask } = state
  const {
    network,
    provider,
    selectedAddress,
    isUnlocked,
    isAccountMenuOpen,
    isNetworkMenuOpen,
  } = metamask

  return {
    network,
    provider,
    selectedAddress,
    isUnlocked,
    isAccountMenuOpen,
    isNetworkMenuOpen,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    toggleAccountMenu: () => dispatch(actions.toggleAccountMenu()),
    toggleNetworkMenu: () => dispatch(actions.toggleNetworkMenu()),
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(AppHeader)
