import { connect } from 'react-redux'
import { compose } from 'recompose'
import { withRouter } from 'react-router-dom'
import ImportAccount from './import-account-with-mode.component'
import action from '../../../../../actions'

const mapStateToProps = ({ metamask }) => {
  const { importMode } = metamask
  return {
    importMode
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setImportAccountMode: (type) => dispatch(action.setImportAccountMode(type)),
    completeOnboarding: () => dispatch(setCompletedOnboarding()),
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(ImportAccount)