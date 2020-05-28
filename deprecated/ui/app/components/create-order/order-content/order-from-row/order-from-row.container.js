import { connect } from 'react-redux'
import { getOrderFromObject } from '../../order.selectors.js'
import OrderFromRow from './order-from-row.component'

function mapStateToProps (state) {
  return {
    from: getOrderFromObject(state),
  }
}

export default connect(mapStateToProps)(OrderFromRow)
