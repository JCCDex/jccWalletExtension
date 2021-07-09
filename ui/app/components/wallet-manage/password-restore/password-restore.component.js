import React, { PureComponent } from 'react'
import InputPrompt from '../../input_prompt'
import PropTypes from 'prop-types'
import Button from '../../button'
export default class PasswordRestore extends PureComponent {

    static propTypes = {
      history: PropTypes.object,
      manageWalletType:PropTypes.string,
      selectAddress:PropTypes.string,
      onSubmit:PropTypes.func,
    }
    
    static contextTypes = {
        t: PropTypes.func,
        metricsEvent: PropTypes.func,
    }      

    state = {
        confirmPassword:'',
        password:'',
        secret:'',
    
        confirmPasswordError: '',
        secretError:'',
        passwordError:'',
      }
    

    handleSecretChange(secret){
        const { t } = this.context
        if(!secret){
          this.setState((state)=>{
            return {
              secret,
              secretError:t('InputEmpty')
            }
          })
        }else{
          this.setState((state)=>{
            return {
              secret,
              secretError:""
            }
          })
        }
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


    render(){
        const { t } = this.context
        const {secretError,passwordError,confirmPasswordError} = this.state;
        const {onSubmit} = this.props
        return(
            <div
            className="first-time-flow__form">
    
            <InputPrompt
              isShowing={false}
            />
            <input
              className="first-time-flow__input"
              onChange={e => this.handleSecretChange(e.target.value)}
              placeholder={t('inputSecret')}
              value={this.state.secret}
            />  
            <InputPrompt
              isShowing={secretError?true:false}
              massage={secretError}
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
              onClick={()=>{onSubmit(this.state.secret,this.state.password)}}
            >
              {t('ok')}
            </Button>
          </div>
        )
    }
}