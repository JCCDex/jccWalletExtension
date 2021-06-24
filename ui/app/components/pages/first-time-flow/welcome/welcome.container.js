import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import { closeWelcomeScreen ,setNetwork} from '../../../../actions'
import Welcome from './welcome.component'

const mapStateToProps = ({ metamask }) => {
  const { welcomeScreenSeen, isInitialized, participateInMetaMetrics,selectedNetWork} = metamask

  return {
    welcomeScreenSeen,
    isInitialized,
    participateInMetaMetrics,
    selectedNetWork
  }
}

const mapDispatchToProps = dispatch => {
  return {
    closeWelcomeScreen: () => dispatch(closeWelcomeScreen()),
    setNetwork:(network)=>dispatch(setNetwork(network))
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(Welcome)
