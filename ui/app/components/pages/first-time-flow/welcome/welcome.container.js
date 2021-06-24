import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import { closeWelcomeScreen ,setNetwork,addNetwork,deleteNetwork} from '../../../../actions'
import Welcome from './welcome.component'

const mapStateToProps = ({ metamask }) => {
  const { welcomeScreenSeen, isInitialized, selectedWalletType,participateInMetaMetrics,selectedNetWork} = metamask

  return {
    welcomeScreenSeen,
    isInitialized,
    participateInMetaMetrics,
    selectedWalletType,
    selectedNetWork
  }
}

const mapDispatchToProps = dispatch => {
  return {
    closeWelcomeScreen: () => dispatch(closeWelcomeScreen()),
    setNetwork:(type,network)=>dispatch(setNetwork(type,network)),
    addNetwork:(type,network)=>dispatch(addNetwork(type,network)),
    deleteNetwork:(type,network)=>dispatch(deleteNetwork(type,network)),
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(Welcome)
