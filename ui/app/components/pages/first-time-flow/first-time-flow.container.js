import { connect } from 'react-redux'
import FirstTimeFlow from './first-time-flow.component'
import { getFirstTimeFlowTypeRoute } from './first-time-flow.selectors'
import {
  createNewAccount,
  createNewVaultAndRestore,
  unlockAndGetSeedPhrase,
  createWalletByType
} from '../../../actions'

const mapStateToProps = state => {
  const { metamask: { completedOnboarding, isInitialized, isUnlocked } } = state

  return {
    completedOnboarding,
    isInitialized,
    isUnlocked,
    nextRoute: getFirstTimeFlowTypeRoute(state),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    // 先创建 wallets
    createWalletByType: (type) => dispatch(createWalletByType(type)),
    // 然后通过  password 和 wallets.secret 创建 Account
    createNewAccount: (password,keypair) => dispatch(createNewAccount(password,keypair)),
    createNewAccountFromSeed: (seedPhrase) => {
      return dispatch(createNewVaultAndRestore(seedPhrase))
    },
    unlockAccount: password => dispatch(unlockAndGetSeedPhrase(password)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FirstTimeFlow)
