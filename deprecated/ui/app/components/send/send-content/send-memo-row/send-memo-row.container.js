import { connect } from 'react-redux'
import {
  updateMemoData,
} from '../../../../actions'

import SendMemoRow from './send-memo-row.component'

export default connect(null,mapDispatchToProps)(SendMemoRow)


function mapDispatchToProps (dispatch) {
  return {
    updateMemoData: memo => dispatch(updateMemoData(memo)),
  }
}
