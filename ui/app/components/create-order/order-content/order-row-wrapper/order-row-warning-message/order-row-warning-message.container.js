import { connect } from 'react-redux'
import { getOrderWarnings } from '../../../order.selectors'
import OrderRowWarningMessage from './order-row-warning-message.component'

export default connect(mapStateToProps)(OrderRowWarningMessage)

function mapStateToProps (state, ownProps) {
  return {
    warnings: getOrderWarnings(state),
    warningType: ownProps.warningType,
  }
}
