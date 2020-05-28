import { connect } from 'react-redux'
import {
  getOrderAmount,
} from '../../order.selectors'
import {
  updateOrderAmount,
} from '../../../../actions'
import OrderAmountRow from './order-amount-row.component'

export default connect(mapStateToProps, mapDispatchToProps)(OrderAmountRow)

function mapStateToProps (state) {
  return {
    amount: getOrderAmount(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    updateOrderAmount: newAmount => dispatch(updateOrderAmount(newAmount)),
  }
}
