import { connect } from 'react-redux'
import { compose } from 'recompose'
import { withRouter } from 'react-router-dom'
import Password from './password-setting.component'
import action from '../../../../../actions'
import { setCompletedOnboarding } from '../../../../../actions'

const firstTimeFlowTypeNameMap = {
  create: 'New Wallet Created',
  'import': 'New Wallet Imported',
}

const mapStateToProps = ({ metamask }) => {
  const { importMode,firstTimeFlowType } = metamask
  return {
    completionMetaMetricsName: firstTimeFlowTypeNameMap[firstTimeFlowType],
    importMode
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setImportAccountMode: (type) => dispatch(action.setImportAccountMode(type)),
    addWallet :(type,address,name)=>dispatch(action.addWallet(type,address,name)),
    completeOnboarding: () => dispatch(setCompletedOnboarding()),
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(Password)