import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Route, Switch, withRouter, matchPath } from 'react-router-dom'
import { compose } from 'recompose'
import actions from './actions'
import log from 'loglevel'
import { getMetaMaskAccounts } from './selectors'

// init
import FirstTimeFlow from './components/first-time-flow'
// accounts
const SendTransactionScreen = require('./components/send/send.container')
const OrderScreen = require('./components/create-order/order.container')

// slideout menu
const Sidebar = require('./components/sidebars').default
const { WALLET_VIEW_SIDEBAR } = require('./components/sidebars/sidebar.constants')

// other views
import Home from './components/pages/home'
import Settings from './components/pages/settings'
import Authenticated from './higher-order-components/authenticated'
import Initialized from './higher-order-components/initialized'
import Lock from './components/pages/lock'
import UiMigrationAnnouncement from './components/ui-migration-annoucement'
const RestoreVaultPage = require('./components/pages/keychains/restore-vault').default
const RevealSeedConfirmation = require('./components/pages/keychains/reveal-seed')
const CreateAccountPage = require('./components/pages/create-account')
const NoticeScreen = require('./components/pages/notice')
import WalletManage  from './components/wallet-manage'
const Loading = require('./components/loading-screen')

import AccountMenu from './components/account-menu'

import NetworkMenu from './components/network-menu'

// Global Modals
const Modal = require('./components/modals/index').Modal
// Global Alert
const Alert = require('./components/alert')
import TitleBar from './components/titlebar' 
import AppHeader from './components/app-header'
import UnlockPage from './components/pages/unlock-page'
import WalletAdd from './components/wallet-add'

// Routes
import {
  DEFAULT_ROUTE,
  LOCK_ROUTE,
  UNLOCK_ROUTE,
  SETTINGS_ROUTE,
  REVEAL_SEED_ROUTE,
  RESTORE_VAULT_ROUTE,
  NEW_ACCOUNT_ROUTE,
  SEND_ROUTE,
  CREATE_ORDER_ROUTE,
  CONFIRM_TRANSACTION_ROUTE,
  INITIALIZE_ROUTE,
  INITIALIZE_UNLOCK_ROUTE,
  NOTICE_ROUTE,

  WALLET_MANAGE_SECRET_EXPORT,
  WALLET_MANAGE_CHANGE_PASSWORD,

  INITIALIZE_CREATE_PASSWORD_ROUTE,
  INITIALIZE_SELECT_ACTION_ROUTE,
  INITIALIZE_IMPORT_WITH_SECRET,
  INITIALIZE_IMPORT_WITH_KEYSTORE,
  INITIALIZE_CREATE_PASSWORD,

  WALLET_ADD,
  WALLET_ADD_BY_IMPORT,
  WALLET_ADD_BY_CREATE,
  WALLET_ADD_SET_NAME,

  WALLET_MANAGE_CHANGE_RESTORE,

  WALLET_MANAGE

} from './routes'

// enums
import {
  ENVIRONMENT_TYPE_NOTIFICATION,
  ENVIRONMENT_TYPE_POPUP,
} from '../../app/scripts/lib/enums'

class App extends Component {
  componentWillMount () {
    const { currentCurrency} = this.props

  }
  
  renderTitle () {
    const { t } = this.context
    let message =''
    this.hideAppHeader()
    switch(this.props.location.pathname){
      case INITIALIZE_SELECT_ACTION_ROUTE:message = t('getStarted');
        break;
      case INITIALIZE_CREATE_PASSWORD_ROUTE:message = t('createKeyPair');break;
      case INITIALIZE_IMPORT_WITH_SECRET:message = t('importAccount');break;
      case INITIALIZE_IMPORT_WITH_KEYSTORE:message = t('importAccount');break;
      case INITIALIZE_CREATE_PASSWORD:message = t('SettingsPassword');break;
      case WALLET_MANAGE_SECRET_EXPORT:message = t('exportPrivateKey');break;
      case WALLET_MANAGE_CHANGE_PASSWORD:message = t('ChangePassword');break;
      case WALLET_MANAGE :message = t('WalletInfo');break;
      case WALLET_MANAGE_CHANGE_RESTORE:message = t('RestorePassword');break;
      case WALLET_ADD_BY_IMPORT:message = t('importAccount');break;
      case WALLET_ADD:message = t('chooseAddMethod');break;
      case WALLET_ADD_BY_CREATE:message = t('createKeyPair');break;
      case WALLET_ADD_SET_NAME:message = t('createAWallet');break;
      default:
        return;

    }
    return (
      <TitleBar title = {message}></TitleBar>
    )
  }

  renderRoutes () {
    console.log("app "+this.props.location.pathname)
    
    return (
      <div>
        <Switch>
          <Route path={LOCK_ROUTE} component={Lock} exact />
          <Authenticated path={WALLET_ADD} component={WalletAdd}/>
          <Authenticated path={WALLET_MANAGE} component ={WalletManage}/>
          <Route path={INITIALIZE_ROUTE} component={FirstTimeFlow} />
          <Initialized path={UNLOCK_ROUTE} component={UnlockPage} exact />
          <Initialized path={RESTORE_VAULT_ROUTE} component={RestoreVaultPage} exact />
          <Authenticated path={REVEAL_SEED_ROUTE} component={RevealSeedConfirmation} exact />
          <Authenticated path={SETTINGS_ROUTE} component={Settings} />
          <Authenticated path={NOTICE_ROUTE} component={NoticeScreen} exact />
          <Authenticated path={SEND_ROUTE} component={SendTransactionScreen} exact />
          <Authenticated path={CREATE_ORDER_ROUTE} component={OrderScreen} exact />
          <Authenticated path={NEW_ACCOUNT_ROUTE} component={CreateAccountPage} />
          <Authenticated path={DEFAULT_ROUTE} component={Home} exact />
        </Switch>
      </div>
    )
  }

  onInitializationUnlockPage () {
    const { location } = this.props
    return Boolean(matchPath(location.pathname, { path: INITIALIZE_UNLOCK_ROUTE, exact: true }))
  }

  hasProviderRequests () {
    const { providerRequests } = this.props
    return Array.isArray(providerRequests) && providerRequests.length > 0
  }

  hideAppHeader () {
    const { location } = this.props

    const isInitializing = Boolean(matchPath(location.pathname, {
      path: INITIALIZE_ROUTE, exact: false,
    }))

    if (isInitializing && !this.onInitializationUnlockPage()) {
      return true
    }

    if (window.METAMASK_UI_TYPE === ENVIRONMENT_TYPE_NOTIFICATION) {
      return true
    }

    if (window.METAMASK_UI_TYPE === ENVIRONMENT_TYPE_POPUP) {
      return  this.hasProviderRequests()
    }
  }

  render () {
    const {
      isLoading,
      alertMessage,
      setMouseUserState,
      sidebar,
    } = this.props
    log.debug('Main ui render function')

    const sidebarOnOverlayClose = sidebarType === WALLET_VIEW_SIDEBAR
      ? () => {
        this.context.metricsEvent({
          eventOpts: {
            category: 'Navigation',
            action: 'Wallet Sidebar',
            name: 'Closed Sidebare Via Overlay',
          },
        })
      }
      : null

    const {
      isOpen: sidebarIsOpen,
      transitionName: sidebarTransitionName,
      type: sidebarType,
      props,
    } = sidebar
    const { transaction: sidebarTransaction } = props || {}
    return (
      <div
        className="app"
        onClick={() => setMouseUserState(true)}
        onKeyDown={e => {
          if (e.keyCode === 9) {
            setMouseUserState(false)
          }
        }}
      >
        <UiMigrationAnnouncement />
        <Modal />
        <Alert
          visible={this.props.alertOpen}
          msg={alertMessage}
        />
        {
          !this.hideAppHeader() && (
            <AppHeader
              hideNetworkIndicator={this.onInitializationUnlockPage()}
            />
          )
        }
        <Sidebar
          sidebarOpen={sidebarIsOpen}
          sidebarShouldClose={sidebarTransaction}
          hideSidebar={this.props.hideSidebar}
          transitionName={sidebarTransitionName}
          type={sidebarType}
          sidebarProps={sidebar.props}
          onOverlayClose={sidebarOnOverlayClose}
        />
        <AccountMenu />
        <NetworkMenu/>
        <div className="main-container-wrapper">
          {this.renderTitle() }
          {this.renderRoutes() }
        </div> 
      </div>
    )
  }

  toggleMetamaskActive () {
    if (!this.props.isUnlocked) {
      // currently inactive: redirect to password box
      var passwordBox = document.querySelector('input[type=password]')
      if (!passwordBox) return
      passwordBox.focus()
    } else {
      // currently active: deactivate
      this.props.dispatch(actions.lockMetamask(false))
    }
  }
}

App.propTypes = {
  currentCurrency: PropTypes.string,
  isLoading: PropTypes.bool,
  loadingMessage: PropTypes.string,
  alertMessage: PropTypes.string,
  provider: PropTypes.object,
  frequentRpcListDetail: PropTypes.array,
  currentView: PropTypes.object,
  sidebar: PropTypes.object,
  alertOpen: PropTypes.bool,
  hideSidebar: PropTypes.func,
  isOnboarding: PropTypes.bool,
  isUnlocked: PropTypes.bool,
  history: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  toggleAccountMenu: PropTypes.func,
  toggleNetworkMenu:PropTypes.func,
  selectedAddress: PropTypes.string,
  noActiveNotices: PropTypes.bool,
  lostAccounts: PropTypes.array,
  isInitialized: PropTypes.bool,
  forgottenPassword: PropTypes.bool,
  activeAddress: PropTypes.string,
  seedWords: PropTypes.string,
  welcomeScreenSeen: PropTypes.bool,
  isPopup: PropTypes.bool,
  isMouseUser: PropTypes.bool,
  setMouseUserState: PropTypes.func,
  t: PropTypes.func,
  providerId: PropTypes.string,
  providerRequests: PropTypes.array,
}

function mapStateToProps (state) {
  const { appState, metamask } = state
  const {
    sidebar,
    alertOpen,
    alertMessage,
    isLoading,
    loadingMessage,
  } = appState

  const accounts = getMetaMaskAccounts(state)

  const {
    identities,
    address,
    isInitialized,
    noActiveNotices,
    seedWords,
    nextUnreadNotice,
    lostAccounts,
    providerRequests,
  } = metamask
  const selected = address || Object.keys(accounts)[0]
 //const selected = address

  return {
    // state from plugin
    sidebar,
    alertOpen,
    alertMessage,
    isLoading,
    loadingMessage,
    noActiveNotices,
    isInitialized,
    isUnlocked: state.metamask.isUnlocked,
    selectedAddress: state.metamask.selectedAddress,
    currentView: state.appState.currentView,
    activeAddress: state.appState.activeAddress,
    transForward: state.appState.transForward,
    isOnboarding: Boolean(!noActiveNotices || seedWords || !isInitialized),
    isPopup: state.metamask.isPopup,
    seedWords: state.metamask.seedWords,
    menuOpen: state.appState.menuOpen,
    provider: state.metamask.provider,
    forgottenPassword: state.appState.forgottenPassword,
    nextUnreadNotice,
    lostAccounts,
    frequentRpcListDetail: state.metamask.frequentRpcListDetail || [],
    currentCurrency: state.metamask.currentCurrency,
    isMouseUser: state.appState.isMouseUser,
    isRevealingSeedWords: state.metamask.isRevealingSeedWords,
    Qr: state.appState.Qr,
    welcomeScreenSeen: state.metamask.welcomeScreenSeen,

    // state needed to get account dropdown temporarily rendering from app bar
    identities,
    selected,
    providerRequests,
  }
}

function mapDispatchToProps (dispatch, ownProps) {
  return {
    dispatch,
    hideSidebar: () => dispatch(actions.hideSidebar()),
    toggleAccountMenu: () => dispatch(actions.toggleAccountMenu()),
    toggleNetworkMenu:() => dispatch(actions.toggleNetworkMenu()),
    setMouseUserState: (isMouseUser) => dispatch(actions.setMouseUserState(isMouseUser)),
  }
}

App.contextTypes = {
  t: PropTypes.func,
  metricsEvent: PropTypes.func,
}

module.exports = compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(App)
