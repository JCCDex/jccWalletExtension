import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
/**
 * 不同链 钱包的导入界面共通，通过父组件 onSubmit 提交表单 实现创建。创建完成后将返回首页
 */
 import {
  DEFAULT_ROUTE,
  WALLET_ADD,
  WALLET_ADD_BY_IMPORT,
  WALLET_ADD_BY_CREATE,
  WALLET_ADD_SET_NAME,
} from '../../routes'

export default class WalletAddSelect extends PureComponent {
    static contextTypes = {
        t: PropTypes.func,
        metricsEvent: PropTypes.func,
      }
    
    static propTypes = {
      CreateWallet:PropTypes.func,
      
    }

    skipToCreateWallet = async () =>{
      const { CreateWallet,history} = this.props
      await CreateWallet()
      history.push(WALLET_ADD_BY_CREATE)
    }

    skipToImportWallet(){
      const {history} = this.props
      history.push(WALLET_ADD_BY_IMPORT)

    }

    render(){
      const {t} = this.context;
        return ( 
        <div className="wallet-create-select">
          <div className ='wallet-create-select__item'
            onClick={()=>{this.skipToCreateWallet()}}>
              <div className ='wallet-create-select__item__font'>
                  {t('createAWallet')}
              </div>
              <div className ='wallet-create-select__item__icon'>
              </div>
          </div>

          <div className ='wallet-create-select__item'
            onClick={()=>{this.skipToImportWallet()}}>
              <div className ='wallet-create-select__item__font'>
                  {t('importWallet')}
              </div>
              <div className ='wallet-create-select__item__icon'>
              </div>
          </div>
        </div>
    )}



}