import { connect } from 'react-redux'
import { compose } from 'recompose'
import { withRouter } from 'react-router-dom'
import Password from './password-setting.component'
import { setCompletedOnboarding,setImportAccountMode ,setAccountLabel,setSelectedAddress} from '../../../../../actions'

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
    setImportAccountMode: (type) => dispatch(setImportAccountMode(type)),
    setCompletedOnboarding: () => dispatch(setCompletedOnboarding()),
    setAccountLabel: (type,account, label) => dispatch(setAccountLabel(type,account, label)),
    setSelectedAddress:(address)=>dispatch(setSelectedAddress(address))
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(Password)