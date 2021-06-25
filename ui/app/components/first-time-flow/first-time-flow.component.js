import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Switch, Route } from 'react-router-dom'
import FirstTimeFlowSwitch from './first-time-flow-switch'
import Welcome from './welcome'
import SelectAction from './select-action'
//import Unlock from '/unlock-page'
import CreatePassword from './create-password'
import SeedPhrase from './seed-phrase'
import {
  DEFAULT_ROUTE,
  INITIALIZE_WELCOME_ROUTE,
  INITIALIZE_CREATE_PASSWORD_ROUTE,
  INITIALIZE_SEED_PHRASE_ROUTE,
  INITIALIZE_UNLOCK_ROUTE,
  INITIALIZE_SELECT_ACTION_ROUTE,
  INITIALIZE_METAMETRICS_OPT_IN_ROUTE,
} from '../../routes'

export default class FirstTimeFlow extends PureComponent {
  static propTypes = {
    completedOnboarding: PropTypes.bool,
    createNewAccount: PropTypes.func,
    createWalletByType : PropTypes.func,
    createNewAccountFromSeed: PropTypes.func,
    history: PropTypes.object,
    isInitialized: PropTypes.bool,
    isUnlocked: PropTypes.bool,
    unlockAccount: PropTypes.func,
    nextRoute: PropTypes.func,
  }
  static contextTypes = {
    t: PropTypes.func,
  }
  state = {
    keypairs: '',
    isImportedKeyring: false,
  }

  componentDidMount () {
    const { completedOnboarding, history, isInitialized, isUnlocked } = this.props

    if (completedOnboarding) {
      history.push(DEFAULT_ROUTE)
      return
    }

    if (isInitialized && !isUnlocked) {
      history.push(INITIALIZE_UNLOCK_ROUTE)
      return
    }
  }

  handleCreateNewAccount = async (password,keypair) => {
    const { createNewAccount } = this.props
    try {
      await createNewAccount(password,keypair)
    } catch (error) {
      throw new Error(error.message)
    }
  }

  handleCreateWalletByType = async (type) => {
    const { createWalletByType } = this.props
    try {
      const keypairs = await createWalletByType(type)
      this.setState({ keypairs })
    } catch (error) {
      throw new Error(error.message)
    }
  }

  handleImportWithSecret = async (secret) => {
    const { createNewAccountFromSeed } = this.props

    try {
      console.log(secret)
      await createNewAccountFromSeed(secret)
      this.setState({ isImportedKeyring: true })
    } catch (error) {
      throw new Error(error.message)
    }
  }

  handleUnlock = async password => {
    const { unlockAccount, history, nextRoute } = this.props

    try {
      const seedPhrase = await unlockAccount(password)
      this.setState({ seedPhrase }, () => {
        history.push(nextRoute)
      })
    } catch (error) {
      throw new Error(error.message)
    }
  }
  
  render () {
    const { keypairs, isImportedKeyring } = this.state
    return (
      <div className="first-time-flow">
        <Switch>
          <Route
            path={INITIALIZE_SEED_PHRASE_ROUTE}
            render={props => (
              <SeedPhrase
                { ...props }
                keypairs={keypairs}
              />
            )}
          />
          <Route
            path={INITIALIZE_CREATE_PASSWORD_ROUTE}
            render={props => (
              <CreatePassword
                { ...props }
                keypairs={keypairs}
                isImportedKeyring={isImportedKeyring}
                onCreateNewAccount={this.handleCreateNewAccount}
                onCreateNewAccountFromSeed={this.handleImportWithSecret}
              />
            )}
          />
          <Route
            path={INITIALIZE_SELECT_ACTION_ROUTE}
            render={props => (
              <SelectAction
                { ...props }
                onCreateWalletByType={this.handleCreateWalletByType}
              />
            )}
          />
          <Route
            exact
            path={INITIALIZE_WELCOME_ROUTE}
            component={Welcome}
          />
          <Route
            exact
            path="*"
            component={FirstTimeFlowSwitch}
          />
        </Switch>
      </div>
    )
  }
}

/**
 *           <Route
            path={INITIALIZE_UNLOCK_ROUTE}
            render={props => (
              <Unlock
                { ...props }
                onSubmit={this.handleUnlock}
              />
            )}
          />
 */