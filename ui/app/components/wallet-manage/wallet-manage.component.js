import React, { PureComponent } from 'react'
import PropTypes, { exact } from 'prop-types'
import { Switch, Route } from 'react-router-dom'
import {WALLET_MANAGE,
    WALLET_MANAGE_CHANGE_NAME,
    WALLET_MANAGE_SECRET_EXPORT,
    WALLET_MANAGE_CHANGE_RESTORE,
    WALLET_MANAGE_CHANGE_PASSWORD,} from '../../routes'
import WalletManageSelect from './wallet-manage-select'
import AccountNameChange from './accout-name-change'
import ExportSecret from './export-secret '
import PasswordChange from './password-change'
import PasswordRestore from './wallet-restore'

export default class WalletManage extends PureComponent {

    static propTypes = {
        history: PropTypes.object,
        manageWalletAddress:PropTypes.string,
        manageWalletType:PropTypes.string,
        getSecret:PropTypes.func,
      }
    static contextTypes = {
        t: PropTypes.func,
        metricsEvent: PropTypes.func,
    }
    deleteWalelt(){

        

    }


    render(){
        //manageWalletAddress 在 state 和 store 是获取钱包信息的key             
        const {manageWalletAddress,manageWalletType,identities,getSecret} = this.props

    return (
        <div>
            <Switch>
                <Route
                    exact
                    path={WALLET_MANAGE}
                    render={props => (
                    <WalletManageSelect
                        { ...props }
                        selectAddress = {manageWalletAddress}
                        identities = {identities}
                    />
                    
                )}
                 />
                <Route
                    exact
                    path={WALLET_MANAGE_CHANGE_NAME}
                    render={props => (
                    <AccountNameChange
                        { ...props }
                        selectAddress = {manageWalletAddress}
                        type = {manageWalletType}
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
                        type = {manageWalletType}
                    />
                )}
                 />

            </Switch>   
        </div>

        )
    }
}
