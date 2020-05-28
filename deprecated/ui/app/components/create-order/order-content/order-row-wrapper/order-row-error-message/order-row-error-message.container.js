import { connect } from 'react-redux'
import { getOrderErrors } from '../../../order.selectors'
import OrderRowErrorMessage from './order-row-error-message.component'

export default connect(mapStateToProps)(OrderRowErrorMessage)

function mapStateToProps (state, ownProps) {
  return {
    errors: getOrderErrors(state),
    errorType: ownProps.errorType,
  }
}
