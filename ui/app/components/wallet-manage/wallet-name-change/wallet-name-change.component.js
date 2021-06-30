import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import InputPrompt from '../../input_prompt'

export default class WalletNameChange extends PureComponent {

    static contextTypes = {
        t: PropTypes.func,
        metricsEvent: PropTypes.func,
      }

    static PropTypes={
        selectAddress:PropTypes.string,
        onSubmit:PropTypes.func,
        onClose:PropTypes.func,
        address:PropTypes.string,
        type:PropTypes.string
    }

    state = {
        newName:'',
        nameError:'',
    }

    handlePasswordChange(newName){
        const { t } = this.context
        this.setState(state => {
            if(newName){
                let nameError = ''
                return {
                    nameError,
                    newName,
                  }
            }else{
                let nameError = t('InputEmpty')
                return {
                    newName,
                    nameError,
                    
                }
            }

        })
      }

    async handleImput(){
        if(this.props.nameError){
            return
        }
        const {onSubmit,address,type,onClose} = this.props;
        await onSubmit(type,address,this.state.newName)
        onClose()
    }

    render(){
        const { t } = this.context
        const {onClose} = this.props
        return(
            <div className='account-name-change'>
                <div className="account-name-change__container">
                    <div className='account-name-change__title'>
                        {t('editingWalletName')}
                    </div>    
                    <input className='account-name-change__input'
                        type='text'
                        onChange={e => this.handlePasswordChange(e.target.value)}
                        value={this.state.newName}
                    /> 
                    <InputPrompt
                    isShowing={this.state.nameError?true:false}
                    massage={this.state.nameError}
                    />
                    <div className= 'account-name-change__button_container'>
                        <button className='account-name-change__button__left'
                            onClick={()=>{onClose()}}>
                            {t('cancel')}
                        </button>
                        <button className='account-name-change__button__right'
                            onClick={()=>{this.handleImput()}}>
                            {t('confirm')}
                        </button>
                    </div>   
                </div>     
            </div>
        )
    }
}