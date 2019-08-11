
import OrderHeader from './order-header.component'
import { connect } from 'react-redux'
import { clearSend } from '../../../actions'

export default connect(null, mapDispatchToProps)(OrderHeader)


function mapDispatchToProps (dispatch) {
    return {
      clearSend: () => dispatch(clearSend()),
    }
  }