import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Switch, Route } from 'react-router-dom'
import WalletAddSelect from './wallet-add-select.component'
import ImportAccount from './../wallet-import'
import WalltBackup from './../wallet-backup'
import SetName from './setName/setName.component'
import {
    DEFAULT_ROUTE,
    WALLET_ADD,
    WALLET_ADD_BY_IMPORT,
    WALLET_ADD_BY_CREATE,
    WALLET_ADD_SET_NAME,
  } from '../../routes'
/**
 * 不同链 钱包的导入界面共通，通过父组件 onSubmit 提交表单 实现创建。创建完成后将返回首页
 */
export default class WalletAdd extends PureComponent {
    static contextTypes = {
        t: PropTypes.func,
        metricsEvent: PropTypes.func,
      }
    
    static propTypes = {
      manageWalletType:PropTypes.string,
      createWalletByType:PropTypes.func,
      setAccountLabel:PropTypes.func,
      setSelectedAddress:PropTypes.func,
    }

    state ={
      keypair:"",
    }

    handleCreateNewAccount = async (type,password,keypair) => {
      const { createNewAccount } = this.props
      try {
        await createNewAccount(type,password,keypair)
      } catch (error) {
        throw new Error(error.message)
      }
    }
  
    handleCreateNewWallet = async ()=>{
      const { createWalletByType ,manageWalletType} = this.props
      let result = await createWalletByType(manageWalletType);
      console.log(result)
      this.setState((state)=>{
        return {
          keypair:result
        }
      })
    }

    handleCreateAccount = async (name,password) => {
        const { createNewAccount ,manageWalletType,setSelectedAddress,setAccountLabel} = this.props
        const {keypair} = this.state;
        try {
          await createNewAccount(manageWalletType,password,keypair)
          await setSelectedAddress(keypair.address)
          await setAccountLabel(manageWalletType,keypair.address,name)
        } catch (error) {
          throw new Error(error.message)
        }
    }


    
    render(){
        return (<div className="wallet-create-select">
        <Switch>
          <Route
              exact
              path={WALLET_ADD}
              render={props => (
              <WalletAddSelect
                  { ...props }
                  CreateWallet={this.handleCreateNewWallet}
              />
              )}
          />
           <Route
              exact
              path={WALLET_ADD_BY_IMPORT}
              render={props => (
              <ImportAccount
                  { ...props }
                  onSubmit={this.handleCreateNewAccount}
              />
              )}
          />
          <Route
              exact
              path={WALLET_ADD_BY_CREATE}
              render={props => (
              <WalltBackup
                  { ...props }
                  keypairs={this.state.keypair}
                  nextRoute={WALLET_ADD_SET_NAME}
              />
              )}
          />      
          <Route 
              exact
              path={WALLET_ADD_SET_NAME}
              render={props => (
              <SetName
                  { ...props }
                  createAccount={this.handleCreateAccount}
              />
              )}
          />   
              

          </Switch>
        </div>

    )}

}