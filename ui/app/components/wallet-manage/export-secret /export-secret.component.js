import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import InputPrompt from '../../input_prompt'
import Button from '../../button'
const qrCode = require('qrcode-generator')
export default class ExportSecret extends PureComponent {

    static contextTypes = {
        t: PropTypes.func,
        metricsEvent: PropTypes.func,

      }

    static PropTypes={
        selectAddress:PropTypes.string,
        onSubmit:PropTypes.func
    }

    state = {
        password:'',
        passwordError:'',
        secret:'',
    }

    async handlePasswordChange(password){
        const { t } = this.context
        this.setState(state => {
          let passwordError = ''
            
          if (password && password.length < 8) {
            passwordError = t('passwordNotLongEnough')
          }
          
          return {
            password,
            passwordError,
          }
        })
      }
      
     handleExport =  async event => {
        event.preventDefault()
        const {selectAddress,onSubmit} =this.props
        const password = this.state.password;
        try {
            const secret = await onSubmit(selectAddress,password)
            this.setState(state => {
                return {
                    secret,
                }
              })
        } catch (error) {
            console.log(error)
            let passwordError = ''
            passwordError = error.message
            this.setState(state => {
                return {
                    passwordError,
                }
            })
        } 
    }

    renderInputPassword(){
        const { t } = this.context
        return (
            <div>
                <InputPrompt
                    isShowing={true}
                />
                <input
                    className="first-time-flow__input"
                    onChange={e => this.handlePasswordChange(e.target.value)}
                    placeholder={t('inputOldPassword')}
                    type='password'
                    value={this.state.password}
                    />  
                <InputPrompt
                    isShowing={this.state.passwordError?true:false}
                    massage={this.state.passwordError}
                />
                <Button
                    type="confirm"
                    className="wallet-manage__button"
                    onClick={this.handleExport}
                    >
                    {t('ok')}
                </Button>

            </div>
        )
    }

    renderSecretBox(){
        const qrImage = qrCode(4, 'M')
        qrImage.addData(this.state.secret)
        qrImage.make()
        return (
        <div className='export-secret'>
            <div className='export-secret__QRcode' 
                dangerouslySetInnerHTML = {{__html: qrImage.createImgTag(3),}} />
            <div className='export-secret __KeyPairs'>
                    {this.state.secret}
            </div>
        </div>
        )

    }

    render(){
        const { t } = this.context
        const {selectAddress } =this.props

        const qrImage = qrCode(4, 'M')
        qrImage.addData(selectAddress)
        qrImage.make()
        return(
            <div className='export-secret'>
                <div className='export-secret__title'>
                    {t('WalletAddress')}
                </div>  
                <div className='export-secret__QRcode' 
                dangerouslySetInnerHTML = {{__html: qrImage.createImgTag(3),}} />

                <div className='export-secret __KeyPairs'>
                    {selectAddress}
                </div>
                <div className='export-secret__title'>
                    {t('WalletSecret')}
                </div> 

                {this.state.secret?this.renderSecretBox():this.renderInputPassword()}

            </div>
        )
    }
}