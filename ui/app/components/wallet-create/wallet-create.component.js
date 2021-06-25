import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Switch, Route } from 'react-router-dom'
import WalletCreateSelect from './wallet-create-select'

import {
    DEFAULT_ROUTE,
  } from '../../routes'
/**
 * 不同链 钱包的导入界面共通，通过父组件 onSubmit 提交表单 实现创建。创建完成后将返回首页
 */
export default class WalletCreate extends PureComponent {
    static contextTypes = {
        t: PropTypes.func,
        metricsEvent: PropTypes.func,
      }
    
    static propTypes = {
      manageWalletType:PropTypes.string,
      setManageWalletType:PropTypes.func,
    }


    handleCreateNewWallet = async (password,keypair) => {
        const { createNewAccount } = this.props
        try {
          await createNewAccount(password,keypair)
        } catch (error) {
          throw new Error(error.message)
        }
    }
    


    render(){
        (<div className="first-time-flow">
        <Switch>
          <Route
              exact
              path={}
              render={props => (
              <WalltBackup
                  { ...props }
                  nextRoute = {INITIALIZE_CREATE_PASSWORD}
                  keypairs = {keypairs}
              />
              )}
          />

        <Route
            exact
            path={}
            render={props => (
              <ImportAccount
                { ...props }
                onSubmit={handleCreateNewAccount}
              />
            )}
          />

        <Route
            exact
            path={}
            render={props => (
              <WalletCreateSelect
                { ...props }
              />
            )}
          />
          </Switch>
        </div>

    )}

}