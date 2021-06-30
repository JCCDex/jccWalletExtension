import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Button from '../../../button'
import {
  INITIALIZE_IMPORT_WITH_SECRET,
  DEFAULT_ROUTE
} from '../../../../routes'

import InputPrompt from './../../../input_prompt'

export default class Password extends PureComponent {
  static contextTypes = {
    metricsEvent: PropTypes.func,
    t: PropTypes.func,
  }

  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    setCompletedOnboarding: PropTypes.func,
    completionMetaMetricsName: PropTypes.string,
    keypairs: PropTypes.object,
    setAccountLabel:PropTypes.func,
    setSelectedAddress:PropTypes.func
  }

  state = {
    password: '',
    confirmPassword: '',
    walletName:'Account 1',

    passwordError: '',
    confirmPasswordError: '',
    walletNameError:'',
  }

  isValid () {
    const {
      password,
      confirmPassword,
      passwordError,
      confirmPasswordError,
    } = this.state

    if (!password || !confirmPassword || password !== confirmPassword) {
      return false
    }

    if (password.length < 8) {
      return false
    }

    return true
  }

  
  handlePasswordChange (password) {
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


  //处理钱包创建
  handleCreate = async event => {
    event.preventDefault()
    //if (!this.isValid()) {return}

    const { password ,walletName} = this.state
    const { onSubmit,setAccountLabel, history,setCompletedOnboarding,completionMetaMetricsName,keypairs,setSelectedAddress} = this.props
    try {
      await onSubmit("jingtum",password,keypairs)
      await setAccountLabel("jingtum",keypairs.address,walletName)
      await setCompletedOnboarding()
      await setSelectedAddress(keypairs.address)
      this.context.metricsEvent({
        eventOpts: {
          category: 'Onboarding',
          action: 'Onboarding Complete',
          name: completionMetaMetricsName,
        },
      })
      setTimeout(
        ()=>{
          history.push(DEFAULT_ROUTE)
        },
        1500
      )
    } catch (error) {
      this.setState({ passwordError: error.message })
    }
  }


  render () {
    const { t } = this.context
    const { password, confirmPassword, walletName,walletNameError, confirmPasswordError,passwordError} = this.state
    return (
      <div>

      <form
        className="first-time-flow__form"
        onSubmit={this.handleCreate}
      >
        <InputPrompt/>

        <input
          className="first-time-flow__input"
          value={"Acco"}
          onChange={event => this.handleWalletNameChange(event.target.value)}
          autoComplete="new-wallet-name"
          placeholder={t('accountName')}
          value={walletName}
        />  

        <InputPrompt
          isShowing={walletNameError?true:false}
          massage={walletNameError}
        />

        <input
          className="first-time-flow__input"
          type="password"
          onChange={event => this.handlePasswordChange(event.target.value)}
          autoComplete="new-password"
          placeholder={t('newPassword')}
          value={password}
        />  

        <InputPrompt
          isShowing={confirmPasswordError?true:false}
          massage={confirmPasswordError}
        />

        <input
          className="first-time-flow__input"
          type="password"
          onChange={event => this.handleConfirmPasswordChange(event.target.value)}
          autoComplete="confirm-password"
          placeholder={t('confirmPassword')}
          value={confirmPassword}
        />  

        <Button
          type="confirm"
          className="first-time-flow__button"
          disabled={!this.isValid()}
          onClick={this.handleCreate}
        >
          { t('ok') }
        </Button>
      </form>
    </div>
    )
  }
}
