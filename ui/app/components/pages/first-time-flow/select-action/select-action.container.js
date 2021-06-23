import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import { setFirstTimeFlowType } from '../../../../actions'
import SelectAction from './select-action.component'
import { getFirstTimeFlowTypeRoute } from '../first-time-flow.selectors'

const mapStateToProps = (state) => {
  return {
    nextRoute: getFirstTimeFlowTypeRoute(state),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setFirstTimeFlowType: type => dispatch(setFirstTimeFlowType(type)),
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(SelectAction)
