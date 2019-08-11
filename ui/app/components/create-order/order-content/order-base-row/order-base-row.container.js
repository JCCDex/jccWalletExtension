import { connect } from 'react-redux'
import OrderBaseRow from './order-base-row.component'

import {
  updateBase,
} from '../../../../actions'

export default connect(null, mapDispatchToProps)(OrderBaseRow)

function mapDispatchToProps (dispatch) {
  return {
    updateBase: base => dispatch(updateBase(base)),
  }
}