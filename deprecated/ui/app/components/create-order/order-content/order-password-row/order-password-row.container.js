import { connect } from 'react-redux'
import {
  updateSendHexData,
} from '../../../../actions'
import OrderPasswordRow from './order-password-row.component'

export default connect(mapStateToProps, mapDispatchToProps)(OrderPasswordRow)

function mapStateToProps (state) {
  return {
    data: state.metamask.send.data,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    updateSendHexData (data) {
      return dispatch(updateSendHexData(data))
    },
  }
}
