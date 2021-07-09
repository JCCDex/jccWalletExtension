import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Button from '../../button'
import InputPrompt from '../../input_prompt'
import { DEFAULT_ROUTE } from '../../../routes'

/**
 * 不同链 钱包的导入界面共通，通过父组件 onSubmit 提交表单 实现创建。创建完成后将返回首页
 */
export default class SetName extends PureComponent {
    static contextTypes = {
        t: PropTypes.func,
        metricsEvent: PropTypes.func,
      }


      state={
        walletName:'Account 0',
        walletNameError:'',
        passwordError:'',
        password:'',
      }

    static PropTypes={
        createAccount:PropTypes.func,
    }

    handleWalletNameChange(walletName){
        const { t } = this.context
        this.setState(state => {
          //添加更多对钱包名的限制
          let walletNameError = '';
          if (!walletName) {
            walletNameError = t('InputEmpty')
          }
          return {
            walletNameError,
            walletName
          }
        })
      }

    handlePasswordChange(password){
      const { t } = this.context
      this.setState(state => {
        const { confirmPassword } = state
        let passwordError = ''
        let confirmPasswordError = ''
  
        if (password && password.length < 8) {
          passwordError = t('passwordNotLongEnough')
        }
  
        if (confirmPassword && password !== confirmPassword) {
          confirmPasswordError = t('passwordsDontMatch')
        }
  
        return {
          password,
          passwordError,
          confirmPasswordError,
        }
      })
    }
      render(){
        const {t} = this.context;
        const {walletNameError,passwordError} = this.state;
        const {createAccount} = this.props;
          return ( 
          <div className="wallet-create-select">
                <InputPrompt
                isShowing={true}
                />
               <input
                className="first-time-flow__input"
                onChange={e => this.handleWalletNameChange(e.target.value)}
                placeholder={t('placeholder1')}
                value={this.state.walletName}
                />  
                <InputPrompt
                isShowing={walletNameError?true:false}
                massage={walletNameError}
                />

                <input
                  className="first-time-flow__input"
                  onChange={e => this.handlePasswordChange(e.target.value)}
                  placeholder={t('placeholder3')}
                  type='password'
                  value={this.state.password}
                />  
                <InputPrompt
                  isShowing={passwordError?true:false}
                  massage={passwordError}
                />

                <Button
                    type="confirm"
                    className="wallet-create-select__button"
                    onClick={()=>{createAccount(this.state.walletName,this.state.password)}}>
                {t('Secret')}{t('import')}
                </Button>
          </div>
      )}
  
}