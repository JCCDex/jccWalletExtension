import { connect } from 'react-redux'
import {
  getOrderPrice,
} from '../../order.selectors'
import {
  updateOrderPrice,
} from '../../../../actions'
import OrderPriceRow from './order-price-row.component'

export default connect(mapStateToProps, mapDispatchToProps)(OrderPriceRow)

function mapStateToProps (state) {
  return {
    price: getOrderPrice(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    updateOrderPrice: newPrice => dispatch(updateOrderPrice(newPrice)),
  }
}
