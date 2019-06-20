import { connect } from 'react-redux'
import MetaMetricsOptIn from './metametrics-opt-in.component'
import { getFirstTimeFlowTypeRoute } from '../first-time-flow.selectors'

const firstTimeFlowTypeNameMap = {
  create: 'Selected Create New Wallet',
  'import': 'Selected Import Wallet',
}

const mapStateToProps = (state) => {
  const { firstTimeFlowType } = state.metamask

  return {
    nextRoute: getFirstTimeFlowTypeRoute(state),
    firstTimeSelectionMetaMetricsName: firstTimeFlowTypeNameMap[firstTimeFlowType],
  }
}

export default connect(mapStateToProps)(MetaMetricsOptIn)
