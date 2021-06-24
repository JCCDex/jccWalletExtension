import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Button from '../../../../button'
import InputPrompt from './../../../../input_prompt'

import { DEFAULT_ROUTE } from '../../../../../routes'
const ImportModeMap = {
  KEYSTORE: 'keystore',
  SECRET: 'secret',
  SEEDPHRASE: 'seedPhrase',
}

export default class ImportAccount extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
    metricsEvent: PropTypes.func,
  }

  static propTypes = {
    history: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    importMode: PropTypes.string,
    completeOnboarding: PropTypes.func,
    setImportAccountMode:PropTypes.func,
    completionMetaMetricsName: PropTypes.string,
    setAccountLabel:PropTypes.func,
    getAddressByType:PropTypes.func
  }

  state = {
    secret: '',
    termsChecked: false,
    confirmPassword:'',
    password:'',
    walletName:'Account 0',

    confirmPasswordError: '',
    walletNameError:'',
    secretError:'',
    passwordError:'',
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


  handleSecretChange(secret){
    const { t } = this.context
    this.setState(state => {
      //这里只做长度的判断，根据执行导入函数的结果来处理密钥
      let secretError = '';
      if (!secret) {
        secretError = t('InputEmpty')
      }
      return {
        secretError,
        secret
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

  //处理导入结果
  handleImport = async event => {
    event.preventDefault()
    if (!this.isValid()) {
      return
    }
    const { secret,password,walletName} = this.state
    const { history, onSubmit ,completeOnboarding,completionMetaMetricsName,setAccountLabel,getAddressByType} = this.props
    try {
      let keypair={};
      keypair.secret = secret
      let address = await getAddressByType(secret,'jingtum')
      await onSubmit(password,keypair)
      await completeOnboarding()
      this.context.metricsEvent({
        eventOpts: {
          category: 'Onboarding',
          action: 'Onboarding Complete',
          name: completionMetaMetricsName,
        },
      })
      setAccountLabel("jingtum",address,walletName)
      setTimeout(
        ()=>{
          history.push(DEFAULT_ROUTE)
        },
        1500
      )
    } catch (error) {
      throw error
    }
  }

  //开始渲染导入表格
  renderImportBySecret(){
    const {secretError,walletNameError,passwordError,confirmPasswordError} = this.state;
    const { t } = this.context
    return (
      <form
        className="first-time-flow__form"
        onSubmit={this.handleImport}>

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
          onChange={e => this.handleSecretChange(e.target.value)}
          placeholder={t('placeholder2')}
          value={this.state.secret}
        />  
        <InputPrompt
          isShowing={secretError?true:false}
          massage={secretError}
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
        <input
          className="first-time-flow__input"
          type='password'
          onChange={e => this.handleConfirmPasswordChange(e.target.value)}
          placeholder={t('placeholder4')}
          value={this.state.confirmPassword}
        /> 

        <InputPrompt
          isShowing={confirmPasswordError?true:false}
          massage={confirmPasswordError}
        />

        <Button
          type="confirm"
          className="first-time-flow__button"
          disabled={!this.isValid()}
          onClick={()=>{this.handleImport}}
        >
          {t('Secret')}{t('import')}
        </Button>
      </form>
    )
  }

  //TODO 根据用户输入的WEIDEX文件 批量导入各个类型的钱包
  renderImportByKeystore(){
    const { t } = this.context
    return (
      <from>
        <input
          className="first-time-flow__input"
          onChange={e => this.handleSeedPhraseChange(e.target.value)}
          placeholder={t('placeholder6')}
          value={this.state.seedPhrase}
        />    
        <input
          className="first-time-flow__input"
          onChange={e => this.handleSeedPhraseChange(e.target.value)}
          placeholder={t('placeholder7')}
          value={this.state.seedPhrase}
        />    

        <button className ='first-time-flow__button'>
          {t('jsonFile')}{t('import')}
        </button>
        <div className="first-time-flow__Symbol">
              <img
                className="first-time-flow__Symbol--icon"
                src="/images/emogi.png"
                height={16}
                width={16}
              />
                <div className="first-time-flow__Symbol--font">
                  {t('Reminder')}
                </div>
         </div>
         <div className="first-time-flow__Describe">
            <div className="first-time-flow__Star">*</div>
            <div className="first-time-flow__FirstUsedTips2">
            { t('ImportKeystoreTips1') }
            </div>
          </div>
        <div className="first-time-flow__Describe">
          <div className="first-time-flow__Star">*</div>
          <div className="first-time-flow__FirstUsedTips2">
          { t('ImportKeystoreTips2') }
          </div>
        </div>

      </from>

    )
  }

  //最后的状态检测
  isValid () {
    //TODO 进行更严格的检测
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
    return !passwordError && !confirmPasswordError
  }

  render () {
    const { t } = this.context;
    const {importMode,setImportAccountMode} = this.props
    return (
      <div>
        <div className = "import__importSelector">
          <button className = "import__importSelector__button--left"
           style = {{background : importMode == ImportModeMap.SECRET? '#586aff':'#ffffff'}}
            onClick ={()=>{
              setImportAccountMode(ImportModeMap.SECRET)
            }}>
              {t('Secret')}{t('import')}
          </button>
          <button className = "import__importSelector__button--right"
           style = {{background : importMode == ImportModeMap.KEYSTORE ? '#586aff':'#ffffff'}}
            onClick ={
              ()=>{
                setImportAccountMode(ImportModeMap.KEYSTORE)
              }
            }>
              {t('jsonFile')}{t('import')}
          </button>
        </div>

        {
          importMode == ImportModeMap.SECRET?this.renderImportBySecret():this.renderImportByKeystore()
        }

        </div>
    )
  }
}