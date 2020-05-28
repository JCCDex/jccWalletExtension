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
  } = metamask

  return {
    network,
    provider,
    selectedAddress,
    isUnlocked,
    isAccountMenuOpen,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    toggleAccountMenu: () => dispatch(actions.toggleAccountMenu()),
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(AppHeader)
