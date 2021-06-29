import React, { PureComponent } from 'react'
import InputPrompt from '../../input_prompt'
import PropTypes from 'prop-types'
import Button from '../../button'
export default class PasswordRestore extends PureComponent {

    static contextTypes = {
        t: PropTypes.func,
        metricsEvent: PropTypes.func,
      }

    state = {
        termsChecked: false,
        confirmPassword:'',
        password:'',
        oldPassword:'',
    
        confirmPasswordError: '',
        oldPasswordError:'',
        passwordError:'',
      }
    

    handleOldPasswordChange(oldPassword){
        const { t } = this.context



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

    handleConfirmPasswordChange (confirmPassword) {
        const { t } = this.context
    
        this.setState(state => {
          const { password } = state
          let confirmPasswordError = ''
    
          if (password !== confirmPassword) {
            confirmPasswordError = t('passwordsDontMatch')
          }
    
          return {
            confirmPassword,
            confirmPasswordError,
          }
        })
      }

      handleChange(){

      }


    render(){
        const { t } = this.context
        const {oldPasswordError,passwordError,confirmPasswordError} = this.state;

        return(
            <form
            className="first-time-flow__form"
            onSubmit={this.handleChange()}>
    
            <InputPrompt
              isShowing={false}
            />
            <input
              className="first-time-flow__input"
              onChange={e => this.handleOldPasswordChange(e.target.value)}
              placeholder={t('inputOldPassword')}
              value={this.state.oldPassword}
            />  
            <InputPrompt
              isShowing={oldPasswordError?true:false}
              massage={oldPasswordError}
            />
    
            <input
              className="first-time-flow__input"
              onChange={e => this.handlePasswordChange(e.target.value)}
              placeholder={t('inputNewPassword')}
              type='password'
              value={this.state.password}
            />  
            <InputPrompt
              isShowing={passwordError?true:false}
              massage={passwordError}
            />
            <input
              className="first-time-flow__input"
              type='password'
              onChange={e => this.handleConfirmPasswordChange(e.target.value)}
              placeholder={t('inputNewPasswordAgein')}
              value={this.state.confirmPassword}
            /> 
    
            <InputPrompt
              isShowing={confirmPasswordError?true:false}
              massage={confirmPasswordError}
            />
    
            <Button
              type="confirm"
              className="wallet-manage__button"
              onClick={()=>{this.handleImport}}
            >
              {t('ok')}
            </Button>
          </form>
        )
    }
}