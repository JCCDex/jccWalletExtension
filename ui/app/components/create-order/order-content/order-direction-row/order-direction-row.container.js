import { connect } from 'react-redux'
import {
  updateDirection,
} from '../../../../actions'
import {
  getAccount,
  getOrderCounter,
} from '../../order.selectors'
const selectors = require('../../../../../app/selectors')

import OrderDirectionRow from './order-direction-row.component'

export default connect(mapStateToProps,mapDispatchToProps)(OrderDirectionRow)

function mapStateToProps (state) {
  return {
    account : getAccount(state),
    counter: getOrderCounter(state),
    accountsAllTokenBal: selectors.getSelectedAddressAllTokens(state),
  }
  
}


function mapDispatchToProps (dispatch) {
  return {
    updateDirection: direction => dispatch(updateDirection(direction)),
  }
}
