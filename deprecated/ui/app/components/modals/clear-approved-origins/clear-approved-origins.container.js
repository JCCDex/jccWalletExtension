import { connect } from 'react-redux'
import { compose } from 'recompose'
import withModalProps from '../../../higher-order-components/with-modal-props'
import ClearApprovedOriginsComponent from './clear-approved-origins.component'
import { clearApprovedOrigins } from '../../../actions'

const mapDispatchToProps = dispatch => {
  return {
    clearApprovedOrigins: () => dispatch(clearApprovedOrigins()),
  }
}

export default compose(
  withModalProps,
  connect(null, mapDispatchToProps)
)(ClearApprovedOriginsComponent)
