import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import InputPrompt from '../input_prompt'
import Button from '../button'
const ExtensionPlatform = require('../../../../app/scripts/platforms/extension')
import {
    WALLET_MANAGE_CHANGE_RESTORE,
    WALLET_MANAGE_SECRET_EXPORT,
    WALLET_MANAGE_CHANGE_PASSWORD,} from '../../routes'
export default class WalletManageSelect extends PureComponent {
    
      static propTypes = {
        identities: PropTypes.object,
        selectAddress:PropTypes.string,
        toggleEditWalletName:PropTypes.func,
      }
      
      static contextTypes = {
          t: PropTypes.func,
          metricsEvent: PropTypes.func,
      }    

    skipToManage(path){
        const {history} = this.props;
        history.push(path)
    }

    deleteWalelt(){
        //通过密码来删除 对应钱包

        

    }

    skipToBlockBrowser(address){
        let url = "????" +address
        const platform = new ExtensionPlatform()
        platform.openWindow({ url })
        this.props.onClose()
    }

    editWalletName(){
        const {toggleEditWalletName} = this.props;
        toggleEditWalletName()
    }

    render(){
        const {t} = this.context;
        const {identities,selectAddress} = this.props;
        return(
            <div className='wallet-manage'>
                <div className ='wallet-manage__wallet_info'>
                    <div className ='wallet-manage__wallet_info__icon'>
                    <img 
                        src={'/images/chain/'+identities[selectAddress].type+'_select.png'}
                        height={48}
                        width={48}
                    />  
                    </div>
                    <div className ='wallet-manage__wallet_info__font'>
                        <div className ='wallet-manage__wallet_info__font_name'
                            onClick={()=>this.editWalletName()}>
                            {identities[selectAddress].name}
                        </div>
                        <div className ='wallet-manage__wallet_info__font_address'>
                            {selectAddress.length< 22? selectAddress:selectAddress.substring(0,7)+"..."+selectAddress.substring(selectAddress.length-8,selectAddress.length)}
                        </div>

                    </div>
                </div >

                <div className ='wallet-manage__item'
                    onClick={()=>{this.skipToManage(WALLET_MANAGE_SECRET_EXPORT)}}>
                    <div className ='wallet-manage__item__font'>
                        {t('exportPrivateKey')}
                    </div>
                    <div className ='wallet-manage__item__icon'>

                    </div>
                </div>
                
                <div className ='wallet-manage__item'
                  onClick={()=>{this.skipToManage(WALLET_MANAGE_CHANGE_PASSWORD)}}>
                    <div className ='wallet-manage__item__font'>
                    {t('ChangePassword')}
                    </div>
                    <div className ='wallet-manage__item__icon'>

                    </div>
                </div>
                
                <div className ='wallet-manage__item'
                    onClick={()=>{this.skipToManage(WALLET_MANAGE_CHANGE_RESTORE)}}>
                    <div className ='wallet-manage__item__font'>
                    {t('RestorePassword')}
                    </div>
                    <div className ='wallet-manage__item__icon'>

                    </div>
                </div>

                <div className ='wallet-manage__item'
                    onClick={()=>{this.skipToBlockBrowser(selectAddress)}}>
                    <div className ='wallet-manage__item__font'>
                        {t('skipToBlockchainBrowser')}
                    </div>
                    <div className ='wallet-manage__item__icon'>

                    </div>
                </div>
                <InputPrompt
                    isShowing={true}
                ></InputPrompt>
                <Button
                    type="confirm"
                    className="wallet-manage__button"
                    onClick={()=>{this.deleteWalelt()}}
                    >
                    {t('DeleteWallet')}
                </Button>
            </div>
        )
    }
}
