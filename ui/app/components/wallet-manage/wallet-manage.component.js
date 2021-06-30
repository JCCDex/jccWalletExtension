import React, { PureComponent } from 'react'
import PropTypes, { exact } from 'prop-types'
import { Switch, Route } from 'react-router-dom'
import {WALLET_MANAGE,
    WALLET_MANAGE_SECRET_EXPORT,
    WALLET_MANAGE_CHANGE_RESTORE,
    WALLET_MANAGE_CHANGE_PASSWORD,} from '../../routes'
import WalletManageSelect from './wallet-manage-select.component'
import WalletNameChange from './wallet-name-change'
import ExportSecret from './export-secret '
import PasswordChange from './password-change'
import PasswordRestore from './password-restore'


export default class WalletManage extends PureComponent {

    static propTypes = {
        history: PropTypes.object,
        manageWalletAddress:PropTypes.string,
        manageWalletType:PropTypes.string,
        getSecret:PropTypes.func,
        toggleEditWalletName:PropTypes.func,
        setAccountLabel:PropTypes.func,
        createNewAccount:PropTypes.func,
        checkSecretByType:PropTypes.func,
        getAddressByType:PropTypes.func,
      }
    static contextTypes = {
        t: PropTypes.func,
        metricsEvent: PropTypes.func,
    }

    deleteWalelt(){

    }

    handlePasswordChange = async (oldPassword,inputNewPassword)=>{
        //先通过当前密码获取密钥，成功则说明密码正确
        const { manageWalletAddress,getSecret,createNewAccount,history} =this.props;
        try{
            let secret = await getSecret(manageWalletAddress,oldPassword)
            if(secret){
                //用新密码加密密钥并存储，同时覆盖 旧钱包信息
                let keypair = {address:manageWalletAddress,secret:secret};
                await createNewAccount(inputNewPassword,keypair)
                history.goBack();
                alert(t('PasswordChangeSuccess'))
                return true;
            }
        }catch(e){
            return e;
        }
    }

    handlePasswordRestore = async (secret,password) =>{
        const { t } = this.context
        const {checkSecretByType,manageWalletAddress,manageWalletType,history,createNewAccount} = this.props
        try{
            console.log(secret)
            console.log(password)
            let value = await checkSecretByType(secret,manageWalletType)
            if(!value){
                alert(t('InputSecretError'))
            }else{
                let keypair = {address:manageWalletAddress,secret:secret};
                await createNewAccount(password,keypair)
                alert(t('PasswordChangeSuccess'))
                history.goBack();
                return true;
            }
        }catch(e){
            alert(e)
        }
      
    }

    render(){
        //manageWalletAddress 在 state 和 store 是获取钱包信息的key             
        const {manageWalletAddress,
            manageWalletType,
            identities,
            getSecret,
            isEditNameShowing,
            setAccountLabel,
            toggleEditWalletName,
        } = this.props

    return (
        <div>
           {isEditNameShowing && <WalletNameChange
                {...this.props}
                identities = {identities}
                address={manageWalletAddress}
                onClose = {toggleEditWalletName}
                onSubmit= {setAccountLabel}
                type = {manageWalletType}
           />}
            <Switch>
                <Route
                    exact
                    path={WALLET_MANAGE}
                    render={props => (
                    <WalletManageSelect
                        { ...props }
                        selectAddress = {manageWalletAddress}
                        identities = {identities}
                        toggleEditWalletName={toggleEditWalletName}
                    />
                    
                )}
                 />
                <Route
                    exact
                    path={WALLET_MANAGE_SECRET_EXPORT}
                    render={props => (
                    <ExportSecret
                        { ...props }
                        selectAddress = {manageWalletAddress}
                        type = {manageWalletType}
                        onSubmit = {getSecret}
                    />
                )}
                 />
                <Route
                    exact
                    path={WALLET_MANAGE_CHANGE_PASSWORD}
                    render={props => (
                    <PasswordChange
                        { ...props }
                        selectAddress = {manageWalletAddress}
                        type = {manageWalletType}
                        onSubmit={this.handlePasswordChange}
                    />
                )}
                 />

                <Route
                    exact
                    path={WALLET_MANAGE_CHANGE_RESTORE}
                    render={props => (
                    <PasswordRestore
                        { ...props }
                        selectAddress = {manageWalletAddress}
                        onSubmit={this.handlePasswordRestore}
                    />
                )}
                 />

            </Switch>   
        </div>

        )
    }
}
