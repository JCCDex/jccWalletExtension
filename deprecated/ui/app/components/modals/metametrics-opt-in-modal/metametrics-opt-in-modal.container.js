import { compose } from 'recompose'
import MetaMetricsOptInModal from './metametrics-opt-in-modal.component'
import withModalProps from '../../../higher-order-components/with-modal-props'


export default compose(
  withModalProps,
)(MetaMetricsOptInModal)
