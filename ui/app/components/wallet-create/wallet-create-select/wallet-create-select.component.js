import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
/**
 * 不同链 钱包的导入界面共通，通过父组件 onSubmit 提交表单 实现创建。创建完成后将返回首页
 */
export default class WalletCreateSelect extends PureComponent {
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
        </div>

    )}



}