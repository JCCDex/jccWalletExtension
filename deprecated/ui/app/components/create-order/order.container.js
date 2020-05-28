import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import {
  getSelectedAddress,
  getOrderAmount,
} from './order.selectors'
import Order from './order.component'

module.exports = compose(
  withRouter,
  connect(mapStateToProps, null)
)(Order)

function mapStateToProps (state) {
  return {
    amount: getOrderAmount(state),
    selectedAddress: getSelectedAddress(state),
    warning: state.appState.warning,
  }
}

