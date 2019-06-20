import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Route, Switch, withRouter, matchPath } from 'react-router-dom'
import { compose } from 'recompose'
import actions from './actions'
import log from 'loglevel'
import { getMetaMaskAccounts } from './selectors'

// init
import FirstTimeFlow from './components/pages/first-time-flow'
// accounts
const SendTransactionScreen = require('./components/send/send.container')

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

const Loading = require('./components/loading-screen')

import AccountMenu from './components/account-menu'

// Global Modals
const Modal = require('./components/modals/index').Modal
// Global Alert
const Alert = require('./components/alert')

import AppHeader from './components/app-header'
import UnlockPage from './components/pages/unlock-page'


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
  CONFIRM_TRANSACTION_ROUTE,
  INITIALIZE_ROUTE,
  INITIALIZE_UNLOCK_ROUTE,
  NOTICE_ROUTE,
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

  renderRoutes () {
    return (
      <Switch>
        <Route path={LOCK_ROUTE} component={Lock} exact />
        <Route path={INITIALIZE_ROUTE} component={FirstTimeFlow} />
        <Initialized path={UNLOCK_ROUTE} component={UnlockPage} exact />
        <Initialized path={RESTORE_VAULT_ROUTE} component={RestoreVaultPage} exact />
        <Authenticated path={REVEAL_SEED_ROUTE} component={RevealSeedConfirmation} exact />
        <Authenticated path={SETTINGS_ROUTE} component={Settings} />
        <Authenticated path={NOTICE_ROUTE} component={NoticeScreen} exact />
        <Authenticated path={SEND_ROUTE} component={SendTransactionScreen} exact />
        <Authenticated path={NEW_ACCOUNT_ROUTE} component={CreateAccountPage} />
        <Authenticated path={DEFAULT_ROUTE} component={Home} exact />
      </Switch>
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
        <div className="main-container-wrapper">
          { this.renderRoutes() }
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
