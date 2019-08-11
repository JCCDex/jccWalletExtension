import { connect } from 'react-redux'
import OrderCounterRow from './order-counter-row.component'

import {
  updateCounter,
} from '../../../../actions'

export default connect(null, mapDispatchToProps)(OrderCounterRow)

function mapDispatchToProps (dispatch) {
  return {
    updateCounter: counter => dispatch(updateCounter(counter)),
  }
}