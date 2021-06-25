import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Switch, Route } from 'react-router-dom'
import WalltBackup from './../../wallet-backup'
import ImportAccount from './../../wallet-import'
import Password from './password-setting'
import {
  INITIALIZE_CREATE_PASSWORD_ROUTE,
  INITIALIZE_IMPORT_WITH_SECRET,
  INITIALIZE_SEED_PHRASE_ROUTE,
  INITIALIZE_CREATE_PASSWORD,
} from '../../../routes'

//整个流程为 先选择导入/创建密钥  然后在流程中输入密码
export default class CreatePassword extends PureComponent {
  static propTypes = {
    history: PropTypes.object,
    isInitialized: PropTypes.bool,
    onCreateNewAccount: PropTypes.func,
    onCreateNewAccountFromSeed: PropTypes.func,
    completeOnboarding: PropTypes.func,
    completionMetaMetricsName: PropTypes.string,
    keypairs: PropTypes.object,
  }

  componentDidMount () {
    const { isInitialized, history } = this.props

    if (isInitialized) {
      history.push(INITIALIZE_SEED_PHRASE_ROUTE)
    }
  }

  render () {
    const { onCreateNewAccount,keypairs} = this.props
    return (
      <div className="first-time-flow__wrapper">
        <Switch>
          <Route
            exact
            path={INITIALIZE_IMPORT_WITH_SECRET}
            render={props => (
              <ImportAccount
                { ...props }
                onSubmit={onCreateNewAccount}
              />
            )}
          />
         <Route
            path={INITIALIZE_CREATE_PASSWORD}
            render={props => (
              <Password
                { ...props }
                keypairs = {keypairs}
                onSubmit={onCreateNewAccount}
              />
            )}
          >
          </Route>
          <Route
            exact
            path={INITIALIZE_CREATE_PASSWORD_ROUTE}
            render={props => (
              <WalltBackup
                { ...props }
                nextRoute = {INITIALIZE_CREATE_PASSWORD}
                keypairs = {keypairs}
              />
            )}
          />
        </Switch>
      </div>
    )
  }
}
