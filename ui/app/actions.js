const pify = require('pify')
const { getTokenAddressFromTokenObject } = require('./util')
const Jccutils = require('./components/send/jccutils')
const { fetchLocale } = require('../i18n-helper')
const log = require('loglevel')
const { ENVIRONMENT_TYPE_NOTIFICATION } = require('../../app/scripts/lib/enums')
const WebcamUtils = require('../lib/webcam-utils')
const LocalSign = require('jcc_jingtum_lib/src/local_sign')
import JingchangWallet from 'jcc_wallet/lib/jingchangWallet'
import JCCExchange from "jcc_exchange";
import { func } from 'joi'
import { dispatch } from 'd3'

var actions = {
  _setBackgroundConnection: _setBackgroundConnection,
  
  GO_HOME: 'GO_HOME',
  goHome: goHome,
  // modal state
  MODAL_OPEN: 'UI_MODAL_OPEN',
  MODAL_CLOSE: 'UI_MODAL_CLOSE',
  showModal: showModal,
  hideModal: hideModal,
  // sidebar state
  SIDEBAR_OPEN: 'UI_SIDEBAR_OPEN',
  SIDEBAR_CLOSE: 'UI_SIDEBAR_CLOSE',
  showSidebar: showSidebar,
  hideSidebar: hideSidebar,
  // sidebar state
  ALERT_OPEN: 'UI_ALERT_OPEN',
  ALERT_CLOSE: 'UI_ALERT_CLOSE',
  showAlert: showAlert,
  hideAlert: hideAlert,
  QR_CODE_DETECTED: 'UI_QR_CODE_DETECTED',
  qrCodeDetected,

  // transition state
  TRANSITION_FORWARD: 'TRANSITION_FORWARD',
  TRANSITION_BACKWARD: 'TRANSITION_BACKWARD',
  transitionForward,
  transitionBackward,
  // remote state
  UPDATE_METAMASK_STATE: 'UPDATE_METAMASK_STATE',
  updateMetamaskState: updateMetamaskState,
  // notices
  MARK_NOTICE_READ: 'MARK_NOTICE_READ',
  markNoticeRead: markNoticeRead,
  SHOW_NOTICE: 'SHOW_NOTICE',
  showNotice: showNotice,
  CLEAR_NOTICES: 'CLEAR_NOTICES',
  clearNotices: clearNotices,
  markAccountsFound,
  // intialize screen
  CREATE_NEW_VAULT_IN_PROGRESS: 'CREATE_NEW_VAULT_IN_PROGRESS',
  SHOW_CREATE_VAULT: 'SHOW_CREATE_VAULT',
  SHOW_RESTORE_VAULT: 'SHOW_RESTORE_VAULT',
  fetchInfoToSync,
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
  forgotPassword: forgotPassword,
  markPasswordForgotten,
  unMarkPasswordForgotten,
  SHOW_INIT_MENU: 'SHOW_INIT_MENU',
  SHOW_NEW_VAULT_SEED: 'SHOW_NEW_VAULT_SEED',
  SHOW_INFO_PAGE: 'SHOW_INFO_PAGE',
  SHOW_IMPORT_PAGE: 'SHOW_IMPORT_PAGE',
  SHOW_NEW_ACCOUNT_PAGE: 'SHOW_NEW_ACCOUNT_PAGE',
  SET_NEW_ACCOUNT_FORM: 'SET_NEW_ACCOUNT_FORM',
  unlockMetamask: unlockMetamask,
  unlockFailed: unlockFailed,
  unlockSucceeded,
  showCreateVault: showCreateVault,
  showRestoreVault: showRestoreVault,
  showInitializeMenu: showInitializeMenu,
  showImportPage,
  showNewAccountPage,
  setNewAccountForm,
  createNewVaultAndKeychain: createNewVaultAndKeychain,
  createNewVaultAndRestore: createNewVaultAndRestore,
  createNewVaultInProgress: createNewVaultInProgress,
  createNewAccount,
  createWalletByType,
  unlockAndGetSeedPhrase,
  addNewKeyring,
  importNewAccount,
  addNewAccount,
  NEW_ACCOUNT_SCREEN: 'NEW_ACCOUNT_SCREEN',
  navigateToNewAccountScreen,
  resetAccount,
  removeAccount,
  showNewVaultSeed: showNewVaultSeed,
  showInfoPage: showInfoPage,
  CLOSE_WELCOME_SCREEN: 'CLOSE_WELCOME_SCREEN',
  closeWelcomeScreen,
  // seed recovery actions
  REVEAL_SEED_CONFIRMATION: 'REVEAL_SEED_CONFIRMATION',
  revealSeedConfirmation: revealSeedConfirmation,
  requestRevealSeed: requestRevealSeed,
  requestRevealSeedWords,
  // unlock screen
  UNLOCK_IN_PROGRESS: 'UNLOCK_IN_PROGRESS',
  UNLOCK_FAILED: 'UNLOCK_FAILED',
  UNLOCK_SUCCEEDED: 'UNLOCK_SUCCEEDED',
  UNLOCK_METAMASK: 'UNLOCK_METAMASK',
  LOCK_METAMASK: 'LOCK_METAMASK',
  tryUnlockMetamask: tryUnlockMetamask,
  lockMetamask: lockMetamask,
  unlockInProgress: unlockInProgress,
  // error handling
  displayWarning: displayWarning,
  DISPLAY_WARNING: 'DISPLAY_WARNING',
  HIDE_WARNING: 'HIDE_WARNING',
  hideWarning: hideWarning,
  // accounts screen
  SET_SELECTED_ACCOUNT: 'SET_SELECTED_ACCOUNT',
  SET_SELECTED_TOKEN: 'SET_SELECTED_TOKEN',
  setSelectedToken,
  SHOW_ACCOUNT_DETAIL: 'SHOW_ACCOUNT_DETAIL',
  SHOW_ACCOUNTS_PAGE: 'SHOW_ACCOUNTS_PAGE',
  SHOW_CONF_TX_PAGE: 'SHOW_CONF_TX_PAGE',
  SHOW_CONF_MSG_PAGE: 'SHOW_CONF_MSG_PAGE',
  SET_CURRENT_FIAT: 'SET_CURRENT_FIAT',
  showQrScanner,
  setCurrentAccountTab,
  // account detail screen
  SHOW_SEND_PAGE: 'SHOW_SEND_PAGE',
  showSendPage: showSendPage,
  SHOW_SEND_TOKEN_PAGE: 'SHOW_SEND_TOKEN_PAGE',
  showSendTokenPage,
  ADD_TO_ADDRESS_BOOK: 'ADD_TO_ADDRESS_BOOK',
  addToAddressBook: addToAddressBook,
  REQUEST_ACCOUNT_EXPORT: 'REQUEST_ACCOUNT_EXPORT',
  requestExportAccount: requestExportAccount,
  EXPORT_ACCOUNT: 'EXPORT_ACCOUNT',
  exportAccount: exportAccount,
  SHOW_PRIVATE_KEY: 'SHOW_PRIVATE_KEY',
  showPrivateKey: showPrivateKey,
  exportAccountComplete,
  SET_ACCOUNT_LABEL: 'SET_ACCOUNT_LABEL',
  setAccountLabel,
  // tx conf screen
  COMPLETED_TX: 'COMPLETED_TX',
  TRANSACTION_ERROR: 'TRANSACTION_ERROR',
  NEXT_TX: 'NEXT_TX',
  PREVIOUS_TX: 'PREV_TX',
  EDIT_TX: 'EDIT_TX',
  signMsg: signMsg,
  cancelMsg: cancelMsg,
  signPersonalMsg,
  cancelPersonalMsg,
  signTypedMsg,
  cancelTypedMsg,
  sendTx: sendTx,
  signTx: signTx,
  createJccOrder: createJccOrder,
  // send screen
  UPDATE_SEND_FROM: 'UPDATE_SEND_FROM',
  UPDATE_SEND_HEX_DATA: 'UPDATE_SEND_HEX_DATA',
  UPDATE_SEND_TOKEN_BALANCE: 'UPDATE_SEND_TOKEN_BALANCE',
  UPDATE_SEND_TO: 'UPDATE_SEND_TO',
  UPDATE_SEND_AMOUNT: 'UPDATE_SEND_AMOUNT',
  UPDATE_SEND_CURRENCY: 'UPDATE_SEND_CURRENCY',
  UPDATE_COUNTER: 'UPDATE_COUNTER',
  UPDATE_BASE: 'UPDATE_BASE',
  UPDATE_ORDER_PRICE: 'UPDATE_ORDER_PRICE',
  UPDATE_ORDER_AMOUNT: 'UPDATE_ORDER_AMOUNT',
  UPDATE_DIRECTION: 'UPDATE_DIRECTION',
  UPDATE_SEND_MEMO: 'UPDATE_SEND_MEMO',
  UPDATE_SEND_ERRORS: 'UPDATE_SEND_ERRORS',
  UPDATE_SEND_WARNINGS: 'UPDATE_SEND_WARNINGS',
  UPDATE_MAX_MODE: 'UPDATE_MAX_MODE',
  UPDATE_SEND: 'UPDATE_SEND',
  CLEAR_SEND: 'CLEAR_SEND',
  OPEN_FROM_DROPDOWN: 'OPEN_FROM_DROPDOWN',
  CLOSE_FROM_DROPDOWN: 'CLOSE_FROM_DROPDOWN',
  setSendTokenBalance,
  updateSendTokenBalance,
  updateSendHexData,
  updateSendTo,
  updateSendAmount,
  updateSendCurrency,
  updateCounter,
  updateBase,
  updateDirection,
  updateOrderPrice,
  updateOrderAmount,
  updateMemoData,
  setMaxModeTo,
  updateSend,
  updateSendErrors,
  updateSendWarnings,
  clearSend,
  setSelectedAddress,
  // app messages
  confirmSeedWords: confirmSeedWords,
  showAccountDetail: showAccountDetail,
  BACK_TO_ACCOUNT_DETAIL: 'BACK_TO_ACCOUNT_DETAIL',
  backToAccountDetail: backToAccountDetail,
  showAccountsPage: showAccountsPage,
  showConfTxPage: showConfTxPage,
  // config screen
  SHOW_CONFIG_PAGE: 'SHOW_CONFIG_PAGE',
  SET_DEFAULT_RPC_TARGET: 'SET_DEFAULT_RPC_TARGET',
  SET_PROVIDER_TYPE: 'SET_PROVIDER_TYPE',
  SET_PREVIOUS_PROVIDER: 'SET_PREVIOUS_PROVIDER',
  showConfigPage,
  SHOW_ADD_TOKEN_PAGE: 'SHOW_ADD_TOKEN_PAGE',
  SHOW_ADD_SUGGESTED_TOKEN_PAGE: 'SHOW_ADD_SUGGESTED_TOKEN_PAGE',
  showAddTokenPage,
  showAddSuggestedTokenPage,
  addToken,
  addTokens,
  removeToken,
  updateTokens,
  removeSuggestedTokens,
  addKnownMethodData,
  UPDATE_TOKENS: 'UPDATE_TOKENS',
  updateAndSetCustomRpc: updateAndSetCustomRpc,
  setProviderType: setProviderType,
  updateProviderType,
  // loading overlay
  SHOW_LOADING: 'SHOW_LOADING_INDICATION',
  HIDE_LOADING: 'HIDE_LOADING_INDICATION',
  showLoadingIndication: showLoadingIndication,
  hideLoadingIndication: hideLoadingIndication,
  PAIR_UPDATE: 'PAIR_UPDATE',
  pairUpdate: pairUpdate,
  coinShiftRquest: coinShiftRquest,
  SHOW_SUB_LOADING_INDICATION: 'SHOW_SUB_LOADING_INDICATION',
  showSubLoadingIndication: showSubLoadingIndication,
  HIDE_SUB_LOADING_INDICATION: 'HIDE_SUB_LOADING_INDICATION',
  hideSubLoadingIndication: hideSubLoadingIndication,
// QR STUFF:
  SHOW_QR: 'SHOW_QR',
  showQrView: showQrView,
  reshowQrCode: reshowQrCode,
  SHOW_QR_VIEW: 'SHOW_QR_VIEW',
// FORGOT PASSWORD:
  BACK_TO_INIT_MENU: 'BACK_TO_INIT_MENU',
  goBackToInitView: goBackToInitView,
  RECOVERY_IN_PROGRESS: 'RECOVERY_IN_PROGRESS',
  BACK_TO_UNLOCK_VIEW: 'BACK_TO_UNLOCK_VIEW',
  backToUnlockView: backToUnlockView,
  // SHOWING KEYCHAIN
  SHOW_NEW_KEYCHAIN: 'SHOW_NEW_KEYCHAIN',
  showNewKeychain: showNewKeychain,

  callBackgroundThenUpdate,
  forceUpdateMetamaskState,

  TOGGLE_ACCOUNT_MENU: 'TOGGLE_ACCOUNT_MENU',
  SETIMPORTMODE:"SET_IMPORTMODE",
  toggleAccountMenu,
  TOGGLE_NETWORK_MENU: 'TOGGLE_NETWORK_MENU',
  toggleNetworkMenu,
  setImportAccountMode,

  useEtherscanProvider,

  SET_USE_BLOCKIE: 'SET_USE_BLOCKIE',
  setUseBlockie,

  SET_PARTICIPATE_IN_METAMETRICS: 'SET_PARTICIPATE_IN_METAMETRICS',
  SET_METAMETRICS_SEND_COUNT: 'SET_METAMETRICS_SEND_COUNT',
  setMetaMetricsSendCount,

  // locale
  SET_CURRENT_LOCALE: 'SET_CURRENT_LOCALE',
  SET_LOCALE_MESSAGES: 'SET_LOCALE_MESSAGES',
  setCurrentLocale,
  updateCurrentLocale,
  setLocaleMessages,
  //
  // Feature Flags
  setFeatureFlag,
  updateFeatureFlags,
  UPDATE_FEATURE_FLAGS: 'UPDATE_FEATURE_FLAGS',

  // Preferences
  setPreference,
  updatePreferences,
  UPDATE_PREFERENCES: 'UPDATE_PREFERENCES',
  setUseNativeCurrencyAsPrimaryCurrencyPreference,
  setShowFiatConversionOnTestnetsPreference,

  // Migration of users to new UI
  setCompletedUiMigration,
  completeUiMigration,
  COMPLETE_UI_MIGRATION: 'COMPLETE_UI_MIGRATION',

  // Onboarding
  setCompletedOnboarding,
  completeOnboarding,
  COMPLETE_ONBOARDING: 'COMPLETE_ONBOARDING',

  setMouseUserState,
  SET_MOUSE_USER_STATE: 'SET_MOUSE_USER_STATE',

  retryTransaction,

  createCancelTransaction,
  createSpeedUpTransaction,

  approveProviderRequest,
  rejectProviderRequest,
  clearApprovedOrigins,

  setFirstTimeFlowType,
  SET_FIRST_TIME_FLOW_TYPE: 'SET_FIRST_TIME_FLOW_TYPE',


  //wallet or chain
  SET_CHAIN_TYPE: 'SET_CHAIN_TYPE',
  SET_SELECTED_WALLET_TYPE:'SET_SELECTED_WALLET_TYPE',


  setSelectedWalletType,
  getWalletsByType,
  setDefaultAccount,
  setCurrentWallet,
  setChainType,

  ADD_WALLET:"ADD_WALLET",
  addWallet,


  //通过 密码 生成 keystore
}

module.exports = actions
var background = null
function _setBackgroundConnection (backgroundConnection) {
  background = backgroundConnection
}

function goHome () {
  return {
    type: actions.GO_HOME,
  }
}

// async actions

function tryUnlockMetamask (password) {
  return dispatch => {
    dispatch(actions.showLoadingIndication())
    dispatch(actions.unlockInProgress())
    log.debug(`background.submitPassword`)

    return new Promise((resolve, reject) => {
      background.submitPassword(password, error => {
        if (error) {
          return reject(error)
        }

        resolve()
      })
    })
      .then(() => {
        dispatch(actions.unlockSucceeded())
        return forceUpdateMetamaskState(dispatch)
      })
      .then(() => {
        return new Promise((resolve, reject) => {
          background.verifySeedPhrase(err => {
            if (err) {
              dispatch(actions.displayWarning(err.message))
              return reject(err)
            }

            resolve()
          })
        })
      })
      .then(() => {
        dispatch(actions.transitionForward())
        dispatch(actions.hideLoadingIndication())
      })
      .catch(err => {
        dispatch(actions.unlockFailed(err.message))
        dispatch(actions.hideLoadingIndication())
        return Promise.reject(err)
      })
  }
}

function transitionForward () {
  return {
    type: this.TRANSITION_FORWARD,
  }
}

function transitionBackward () {
  return {
    type: this.TRANSITION_BACKWARD,
  }
}

function confirmSeedWords () {
  return dispatch => {
    dispatch(actions.showLoadingIndication())
    log.debug(`background.clearSeedWordCache`)
    return new Promise((resolve, reject) => {
      background.clearSeedWordCache((err, account) => {
        dispatch(actions.hideLoadingIndication())
        if (err) {
          dispatch(actions.displayWarning(err.message))
          return reject(err)
        }

        log.info('Seed word cache cleared. ' + account)
        dispatch(actions.showAccountsPage())
        resolve(account)
      })
    })
  }
}

function createNewVaultAndRestore (password, seed) {
  return (dispatch) => {
    dispatch(actions.showLoadingIndication())
    log.debug(`background.createNewVaultAndRestore`)

    return new Promise((resolve, reject) => {
      background.clearSeedWordCache((err) => {
        if (err) {
          return reject(err)
        }

        background.createNewVaultAndRestore(password, seed, (err) => {
          if (err) {
            return reject(err)
          }

          resolve()
        })
      })
    })
      .then(() => dispatch(actions.unMarkPasswordForgotten()))
      .then(() => {
        dispatch(actions.showAccountsPage())
        dispatch(actions.hideLoadingIndication())
      })
      .catch(err => {
        dispatch(actions.displayWarning(err.message))
        dispatch(actions.hideLoadingIndication())
        return Promise.reject(err)
      })
  }
}

function createNewVaultAndKeychain (password) {
  return dispatch => {
    dispatch(actions.showLoadingIndication())
    log.debug(`background.createNewVaultAndKeychain`)

    return new Promise((resolve, reject) => {
      background.createNewVaultAndKeychain(password, err => {
        if (err) {
          dispatch(actions.displayWarning(err.message))
          return reject(err)
        }

      })
    })
      .then(() => forceUpdateMetamaskState(dispatch))
      .then(() => dispatch(actions.hideLoadingIndication()))
      .catch(() => dispatch(actions.hideLoadingIndication()))
  }
}

function createNewAccount (password,keypair) {
  return async dispatch => {
    dispatch(actions.showLoadingIndication())
    try {
      await createNewVault(password,keypair.secret)
      dispatch(actions.hideLoadingIndication())
    } catch (error) {
      dispatch(actions.hideLoadingIndication())
      dispatch(actions.displayWarning(error.message))
      throw new Error(error.message)
    }
  }
}

function createWalletByType (type) {
  return dispatch =>{
    return new Promise((resolve, reject) => {
        background.createWalletByType(type, (error, keypair) => {
          if (error) {
            console.log(error)
            reject(error)
          }
          console.log(keypair)
          resolve(keypair)
      })
    })
  }
}

function addWallet(walletType,account,name){

  return (dispatch) => {
    dispatch(actions.showLoadingIndication())

    return new Promise((resolve, reject) => {
      background.setAccountLabel(account, label, (err) => {

        dispatch(actions.hideLoadingIndication())

        if (err) {
          dispatch(actions.displayWarning(err.message))
          reject(err)
        }

        dispatch({
          type:actions.ADD_WALLET,
          value:{walletType,account,name},
        })

        resolve(account)
      })
    })
  }
}



function unlockAndGetSeedPhrase (password) {
  return async dispatch => {
    dispatch(actions.showLoadingIndication())

    try {
      await submitPassword(password)
      const seedWords = await verifySeedPhrase()
      await forceUpdateMetamaskState(dispatch)
      dispatch(actions.hideLoadingIndication())
      return seedWords
    } catch (error) {
      dispatch(actions.hideLoadingIndication())
      dispatch(actions.displayWarning(error.message))
      throw new Error(error.message)
    }
  }
}

function revealSeedConfirmation () {
  return {
    type: this.REVEAL_SEED_CONFIRMATION,
  }
}

function submitPassword (password) {
  return new Promise((resolve, reject) => {
    background.submitPassword(password, error => {
      if (error) {
        return reject(error)
      }

      resolve()
    })
  })
}

function createNewVault (password,secret) {
  return new Promise((resolve, reject) => {
    background.createNewVaultAndKeychain(password,secret, (error, inst) => {
      if (error) {
        console.log(error)
        return reject(error)
      }
      console.log(inst)
      resolve(inst)
    })
  })
}

function verifyPassword (password) {
  return new Promise((resolve, reject) => {
    background.submitPassword(password, error => {
      if (error) {
        return reject(error)
      }

      resolve(true)
    })
  })
}

function verifySeedPhrase () {
  return new Promise((resolve, reject) => {
    background.verifySeedPhrase((error, seedWords) => {
      if (error) {
        return reject(error)
      }

      resolve(seedWords)
    })
  })
}

function requestRevealSeed (password) {
  return dispatch => {
    dispatch(actions.showLoadingIndication())
    return new Promise((resolve, reject) => {
      background.submitPassword(password, err => {
        if (err) {
          dispatch(actions.displayWarning(err.message))
          return reject(err)
        }
        background.placeSeedWords((err, result) => {
          if (err) {
            dispatch(actions.displayWarning(err.message))
            return reject(err)
          }

          dispatch(actions.showNewVaultSeed(result))
          dispatch(actions.hideLoadingIndication())
          resolve()
        })
      })
    })
  }
}

function requestRevealSeedWords (password) {
  return async dispatch => {
    dispatch(actions.showLoadingIndication())
    log.debug(`background.submitPassword`)

    try {
      await verifyPassword(password)
      const seedWords = await verifySeedPhrase()
      dispatch(actions.hideLoadingIndication())
      return seedWords
    } catch (error) {
      dispatch(actions.hideLoadingIndication())
      dispatch(actions.displayWarning(error.message))
      throw new Error(error.message)
    }
  }
}

function fetchInfoToSync () {
  return dispatch => {
    log.debug(`background.fetchInfoToSync`)
    return new Promise((resolve, reject) => {
      background.fetchInfoToSync((err, result) => {
        if (err) {
          dispatch(actions.displayWarning(err.message))
          return reject(err)
        }
        resolve(result)
      })
    })
  }
}

function resetAccount () {
  return dispatch => {
    dispatch(actions.showLoadingIndication())

    return new Promise((resolve, reject) => {
      background.resetAccount((err, account) => {
        dispatch(actions.hideLoadingIndication())
        if (err) {
          dispatch(actions.displayWarning(err.message))
          return reject(err)
        }

        log.info('Transaction history reset for ' + account)
        dispatch(actions.showAccountsPage())
        resolve(account)
      })
    })
  }
}

function removeAccount (address) {
  return dispatch => {
    dispatch(actions.showLoadingIndication())

    return new Promise((resolve, reject) => {
      background.removeAccount(address, (err, account) => {
        dispatch(actions.hideLoadingIndication())
        if (err) {
          dispatch(actions.displayWarning(err.message))
          return reject(err)
        }

        log.info('Account removed: ' + account)
        dispatch(actions.showAccountsPage())
        resolve()
      })
    })
  }
}

function addNewKeyring (type, opts) {
  return (dispatch) => {
    dispatch(actions.showLoadingIndication())
    log.debug(`background.addNewKeyring`)
    background.addNewKeyring(type, opts, (err) => {
      dispatch(actions.hideLoadingIndication())
      if (err) return dispatch(actions.displayWarning(err.message))
      dispatch(actions.showAccountsPage())
    })
  }
}

function importNewAccount (strategy, args) {
  return async (dispatch) => {
    let newState
    dispatch(actions.showLoadingIndication('This may take a while, please be patient.'))
    try {
      log.debug(`background.importAccountWithStrategy`)
      await pify(background.importAccountWithStrategy).call(background, strategy, args)
      log.debug(`background.getState`)
      newState = await pify(background.getState).call(background)
    } catch (err) {
      dispatch(actions.hideLoadingIndication())
      dispatch(actions.displayWarning(err.message))
      throw err
    }
    dispatch(actions.hideLoadingIndication())
    dispatch(actions.updateMetamaskState(newState))
    if (newState.selectedAddress) {
      dispatch({
        type: actions.SHOW_ACCOUNT_DETAIL,
        value: newState.selectedAddress,
      })
    }
    return newState
  }
}

function navigateToNewAccountScreen () {
  return {
    type: this.NEW_ACCOUNT_SCREEN,
  }
}

function addNewAccount (password) {
  log.debug(`background.addNewAccount`)
  return (dispatch, getState) => {
    dispatch(actions.showLoadingIndication())
    return new Promise((resolve, reject) => {
      background.addNewAccount(password, (err, address) => {
        if (err) {
          dispatch(actions.displayWarning(err.message))
          return reject(err)
        }
        dispatch(actions.hideLoadingIndication())

        forceUpdateMetamaskState(dispatch)
        return resolve(address)
      })
    })
  }
}

function showInfoPage () {
  return {
    type: actions.SHOW_INFO_PAGE,
  }
}

function showQrScanner (ROUTE) {
  return (dispatch, getState) => {
    return WebcamUtils.checkStatus()
    .then(status => {
      if (!status.environmentReady) {
         // We need to switch to fullscreen mode to ask for permission
         global.platform.openExtensionInBrowser(`${ROUTE}`, `scan=true`)
      } else {
        dispatch(actions.showModal({
          name: 'QR_SCANNER',
        }))
      }
    }).catch(e => {
      dispatch(actions.showModal({
        name: 'QR_SCANNER',
        error: true,
        errorType: e.type,
      }))
    })
  }
}


function signMsg (msgData) {
  log.debug('action - signMsg')
  return (dispatch, getState) => {
    dispatch(actions.showLoadingIndication())

    return new Promise((resolve, reject) => {
      log.debug(`actions calling background.signMessage`)
      background.signMessage(msgData, (err, newState) => {
        log.debug('signMessage called back')
        dispatch(actions.updateMetamaskState(newState))
        dispatch(actions.hideLoadingIndication())

        if (err) {
          log.error(err)
          dispatch(actions.displayWarning(err.message))
          return reject(err)
        }

        if (global.METAMASK_UI_TYPE === ENVIRONMENT_TYPE_NOTIFICATION ) {
          return global.platform.closeCurrentWindow()
        }

        return resolve(msgData)
      })
    })
  }
}

function signPersonalMsg (msgData) {
  log.debug('action - signPersonalMsg')
  return (dispatch, getState) => {
    dispatch(actions.showLoadingIndication())

    return new Promise((resolve, reject) => {
      log.debug(`actions calling background.signPersonalMessage`)
      background.signPersonalMessage(msgData, (err, newState) => {
        log.debug('signPersonalMessage called back')
        dispatch(actions.updateMetamaskState(newState))
        dispatch(actions.hideLoadingIndication())

        if (err) {
          log.error(err)
          dispatch(actions.displayWarning(err.message))
          return reject(err)
        }

        if (global.METAMASK_UI_TYPE === ENVIRONMENT_TYPE_NOTIFICATION &&
          !hasUnconfirmedTransactions(getState())) {
          return global.platform.closeCurrentWindow()
        }

        return resolve(msgData)
      })
    })
  }
}

function signTypedMsg (msgData) {
  log.debug('action - signTypedMsg')
  return (dispatch, getState) => {
    dispatch(actions.showLoadingIndication())

    return new Promise((resolve, reject) => {
      log.debug(`actions calling background.signTypedMessage`)
      background.signTypedMessage(msgData, (err, newState) => {
        log.debug('signTypedMessage called back')
        dispatch(actions.updateMetamaskState(newState))
        dispatch(actions.hideLoadingIndication())

        if (err) {
          log.error(err)
          dispatch(actions.displayWarning(err.message))
          return reject(err)
        }

        if (global.METAMASK_UI_TYPE === ENVIRONMENT_TYPE_NOTIFICATION &&
          !hasUnconfirmedTransactions(getState())) {
          return global.platform.closeCurrentWindow()
        }

        return resolve(msgData)
      })
    })
  }
}

 function signTx (from, txParams, password) {

  return async (dispatch) => {
    const jccutils = new Jccutils()
    const jccInstance = await jccutils.getJccInstance()
    const seq = await jccInstance.getSequence(from)
    txParams.Sequence = seq.data.sequence
    const inst = new JingchangWallet(JingchangWallet.get(), true, false)
    let key = ''
    try {
       key = await inst.getSecretWithAddress(password, from)
    } catch (err) {
      alert(err.message)
      dispatch(actions.displayWarning(err.message))
      return
    }
      const seed = {
        seed: key,
    }
    const signature = LocalSign(txParams, seed)
     jccInstance.transferAccount(signature).then((data) => {
        if (data.result === true) {
          alert(data.msg)
         // history.push(DEFAULT_ROUTE)
       //   history.go(0)
       history.go(-1)
        } else {
          alert(data.msg)
           dispatch(actions.displayWarning(data.msg))
        }
       // if (err) {
       //   return dispatch(actions.displayWarning(err.message))
      //  }
      })
    }
}

function createJccOrder (from, txParams, password) {

  return async (dispatch) => {
    const jccutils = new Jccutils()
    const inst = new JingchangWallet(JingchangWallet.get(), true, false)
    let key = ''
    try {
       key = await inst.getSecretWithAddress(password, from.address)
    } catch (err) {
      alert(err.message)
      return
    }
    const hosts = await jccutils.getExHosts()
    try {
      JCCExchange.init(hosts, 443, true);
      const hash = await JCCExchange.createOrder(txParams.address, key, txParams.amount, txParams.base, txParams.counter, txParams.sum, txParams.type, txParams.issuer)
      alert('交易成功')
      history.go(-1)
    } catch (error) {
      alert(error)
        console.log(error);
    }
    }
}

function updateSendTokenBalance ({
  selectedToken,
  tokenContract,
  address,
}) {
  return (dispatch) => {
    const jccutils = new Jccutils()
    const tokenBalancePromise = jccutils.getBalance(address)
    return tokenBalancePromise
      .then(bal => {
        if (bal) {
          bal.forEach(data => {
            if (data.currency === selectedToken) {
              dispatch(setSendTokenBalance(data.value))
            }
          })
          //const newTokenBalance = calcTokenBalance({ selectedToken, usersToken })
         // dispatch(setSendTokenBalance(newTokenBalance))
        }
      })
      .catch(err => {
        log.error(err)
        updateSendErrors({ tokenBalance: 'tokenBalanceError' })
      })
  }
}

function updateSendErrors (errorObject) {
  return {
    type: actions.UPDATE_SEND_ERRORS,
    value: errorObject,
  }
}

function updateSendWarnings (warningObject) {
  return {
    type: actions.UPDATE_SEND_WARNINGS,
    value: warningObject,
  }
}

function setSendTokenBalance (tokenBalance) {
  return {
    type: actions.UPDATE_SEND_TOKEN_BALANCE,
    value: tokenBalance,
  }
}

function updateSendHexData (value) {
  return {
    type: actions.UPDATE_SEND_HEX_DATA,
    value,
  }
}

function updateSendTo (to, nickname = '') {
  return {
    type: actions.UPDATE_SEND_TO,
    value: { to, nickname },
  }
}

function updateSendAmount (amount) {
  return {
    type: actions.UPDATE_SEND_AMOUNT,
    value: amount,
  }
}

function updateSendCurrency (sendCur) {
  return {
    type: actions.UPDATE_SEND_CURRENCY,
    value: sendCur,
  }
}

function updateCounter (counter) {
  return {
    type: actions.UPDATE_COUNTER,
    value: counter,
  }
}

function updateBase (base) {
  return {
    type: actions.UPDATE_BASE,
    value: base,
  }
}

function updateDirection (direction) {
  return {
    type: actions.UPDATE_DIRECTION,
    value: direction,
  }
}

function updateOrderPrice (price) {
  return {
    type: actions.UPDATE_ORDER_PRICE,
    value: price
  }
}

function updateOrderAmount (amount) {
  return {
    type: actions.UPDATE_ORDER_AMOUNT,
    value: amount
  }
}

function updateMemoData (memo) {
  return {
    type: actions.UPDATE_SEND_MEMO,
    value: memo,
  }
}

function setMaxModeTo (bool) {
  return {
    type: actions.UPDATE_MAX_MODE,
    value: bool,
  }
}

function updateSend (newSend) {
  return {
    type: actions.UPDATE_SEND,
    value: newSend,
  }
}

function clearSend () {
  return {
    type: actions.CLEAR_SEND,
  }
}


function sendTx (txData) {
  log.info(`actions - sendTx: ${JSON.stringify(txData.txParams)}`)
  return (dispatch, getState) => {
    log.debug(`actions calling background.approveTransaction`)
    background.approveTransaction(txData.id, (err) => {
      if (err) {
        return log.error(err.message)
      }

      if (global.METAMASK_UI_TYPE === ENVIRONMENT_TYPE_NOTIFICATION &&
        !hasUnconfirmedTransactions(getState())) {
        return global.platform.closeCurrentWindow()
      }
    })
  }
}

function cancelMsg (msgData) {
  return (dispatch, getState) => {
    dispatch(actions.showLoadingIndication())

    return new Promise((resolve, reject) => {
      log.debug(`background.cancelMessage`)
      background.cancelMessage(msgData.id, (err, newState) => {
        dispatch(actions.updateMetamaskState(newState))
        dispatch(actions.hideLoadingIndication())

        if (err) {
          return reject(err)
        }

        if (global.METAMASK_UI_TYPE === ENVIRONMENT_TYPE_NOTIFICATION &&
          !hasUnconfirmedTransactions(getState())) {
          return global.platform.closeCurrentWindow()
        }

        return resolve(msgData)
      })
    })
  }
}

function cancelPersonalMsg (msgData) {
  return (dispatch, getState) => {
    dispatch(actions.showLoadingIndication())

    return new Promise((resolve, reject) => {
      const id = msgData.id
      background.cancelPersonalMessage(id, (err, newState) => {
        dispatch(actions.updateMetamaskState(newState))
        dispatch(actions.hideLoadingIndication())

        if (err) {
          return reject(err)
        }

        if (global.METAMASK_UI_TYPE === ENVIRONMENT_TYPE_NOTIFICATION &&
          !hasUnconfirmedTransactions(getState())) {
          return global.platform.closeCurrentWindow()
        }

        return resolve(msgData)
      })
    })
  }
}

function cancelTypedMsg (msgData) {
  return (dispatch, getState) => {
    dispatch(actions.showLoadingIndication())

    return new Promise((resolve, reject) => {
      const id = msgData.id
      background.cancelTypedMessage(id, (err, newState) => {
        dispatch(actions.updateMetamaskState(newState))
        dispatch(actions.hideLoadingIndication())

        if (err) {
          return reject(err)
        }

        if (global.METAMASK_UI_TYPE === ENVIRONMENT_TYPE_NOTIFICATION &&
          !hasUnconfirmedTransactions(getState())) {
          return global.platform.closeCurrentWindow()
        }

        return resolve(msgData)
      })
    })
  }
}

//
// initialize screen
//

function showCreateVault () {
  return {
    type: actions.SHOW_CREATE_VAULT,
  }
}

function showRestoreVault () {
  return {
    type: actions.SHOW_RESTORE_VAULT,
  }
}

function markPasswordForgotten () {
  return (dispatch) => {
    return background.markPasswordForgotten(() => {
      dispatch(actions.hideLoadingIndication())
      dispatch(actions.forgotPassword())
      forceUpdateMetamaskState(dispatch)
    })
  }
}

function unMarkPasswordForgotten () {
  return dispatch => {
    return new Promise(resolve => {
      background.unMarkPasswordForgotten(() => {
        dispatch(actions.forgotPassword(false))
        resolve()
      })
    })
      .then(() => forceUpdateMetamaskState(dispatch))
  }
}

function forgotPassword (forgotPasswordState = true) {
  return {
    type: actions.FORGOT_PASSWORD,
    value: forgotPasswordState,
  }
}

function showInitializeMenu () {
  return {
    type: actions.SHOW_INIT_MENU,
  }
}

function showImportPage () {
  return {
    type: actions.SHOW_IMPORT_PAGE,
  }
}

function showNewAccountPage (formToSelect) {
  return {
    type: actions.SHOW_NEW_ACCOUNT_PAGE,
    formToSelect,
  }
}

function setNewAccountForm (formToSelect) {
  return {
    type: actions.SET_NEW_ACCOUNT_FORM,
    formToSelect,
  }
}

function createNewVaultInProgress () {
  return {
    type: actions.CREATE_NEW_VAULT_IN_PROGRESS,
  }
}

function showNewVaultSeed (seed) {
  return {
    type: actions.SHOW_NEW_VAULT_SEED,
    value: seed,
  }
}

function closeWelcomeScreen () {
  return {
    type: actions.CLOSE_WELCOME_SCREEN,
  }
}

function backToUnlockView () {
  return {
    type: actions.BACK_TO_UNLOCK_VIEW,
  }
}

function showNewKeychain () {
  return {
    type: actions.SHOW_NEW_KEYCHAIN,
  }
}

//
// unlock screen
//

function unlockInProgress () {
  return {
    type: actions.UNLOCK_IN_PROGRESS,
  }
}

function unlockFailed (message) {
  return {
    type: actions.UNLOCK_FAILED,
    value: message,
  }
}

function unlockSucceeded (message) {
  return {
    type: actions.UNLOCK_SUCCEEDED,
    value: message,
  }
}

function unlockMetamask (account) {
  return {
    type: actions.UNLOCK_METAMASK,
    value: account,
  }
}

function updateMetamaskState (newState) {
  return {
    type: actions.UPDATE_METAMASK_STATE,
    value: newState,
  }
}

const backgroundSetLocked = () => {
  return new Promise((resolve, reject) => {
    background.setLocked(error => {
      if (error) {
        return reject(error)
      }
      resolve()
    })
  })
}

const updateMetamaskStateFromBackground = () => {
  log.debug(`background.getState`)

  return new Promise((resolve, reject) => {
    background.getState((error, newState) => {
      if (error) {
        return reject(error)
      }

      resolve(newState)
    })
  })
}

function lockMetamask () {
  log.debug(`background.setLocked`)

  return dispatch => {
    dispatch(actions.showLoadingIndication())

    return backgroundSetLocked()
      .then(() => updateMetamaskStateFromBackground())
      .catch(error => {
        dispatch(actions.displayWarning(error.message))
        return Promise.reject(error)
      })
      .then(newState => {
        dispatch(actions.updateMetamaskState(newState))
        dispatch(actions.hideLoadingIndication())
        dispatch({ type: actions.LOCK_METAMASK })
      })
      .catch(() => {
        dispatch(actions.hideLoadingIndication())
        dispatch({ type: actions.LOCK_METAMASK })
      })
  }
}

function setCurrentAccountTab (newTabName) {
  log.debug(`background.setCurrentAccountTab: ${newTabName}`)
  return callBackgroundThenUpdateNoSpinner(background.setCurrentAccountTab, newTabName)
}

function setSelectedToken (tokenAddress) {
  return {
    type: actions.SET_SELECTED_TOKEN,
    value: tokenAddress || null,
  }
}


function setSelectedAddress (address) {
  return (dispatch) => {
    dispatch(actions.showLoadingIndication())
    log.debug(`background.setSelectedAddress`)
    background.setSelectedAddress(address, (err) => {
      dispatch(actions.hideLoadingIndication())
      if (err) {
        return dispatch(actions.displayWarning(err.message))
      }
    })
  }
}

function showAccountDetail (address) {
  return (dispatch) => {
    dispatch(actions.showLoadingIndication())
    log.debug(`background.setSelectedAddress`)
    background.setSelectedAddress(address, (err, tokens) => {
      dispatch(actions.hideLoadingIndication())
      if (err) {
        return dispatch(actions.displayWarning(err.message))
      }
      dispatch(updateTokens(tokens))
      dispatch({
        type: actions.SHOW_ACCOUNT_DETAIL,
        value: address,
      })
      dispatch(actions.setSelectedToken())
    })
  }
}

function backToAccountDetail (address) {
  return {
    type: actions.BACK_TO_ACCOUNT_DETAIL,
    value: address,
  }
}

function showAccountsPage () {
  return {
    type: actions.SHOW_ACCOUNTS_PAGE,
  }
}

function showConfTxPage ({transForward = true, id}) {
  return {
    type: actions.SHOW_CONF_TX_PAGE,
    transForward,
    id,
  }
}

function showConfigPage (transitionForward = true) {
  return {
    type: actions.SHOW_CONFIG_PAGE,
    value: transitionForward,
  }
}

function showAddTokenPage (transitionForward = true) {
  return {
    type: actions.SHOW_ADD_TOKEN_PAGE,
    value: transitionForward,
  }
}

function showAddSuggestedTokenPage (transitionForward = true) {
  return {
    type: actions.SHOW_ADD_SUGGESTED_TOKEN_PAGE,
    value: transitionForward,
  }
}

function addToken (address, symbol, decimals, image) {
  return (dispatch) => {
    dispatch(actions.showLoadingIndication())
    return new Promise((resolve, reject) => {
      background.addToken(address, symbol, decimals, image, (err, tokens) => {
        dispatch(actions.hideLoadingIndication())
        if (err) {
          dispatch(actions.displayWarning(err.message))
          reject(err)
        }
        dispatch(actions.updateTokens(tokens))
        resolve(tokens)
      })
    })
  }
}

function removeToken (address) {
  return (dispatch) => {
    dispatch(actions.showLoadingIndication())
    return new Promise((resolve, reject) => {
      background.removeToken(address, (err, tokens) => {
        dispatch(actions.hideLoadingIndication())
        if (err) {
          dispatch(actions.displayWarning(err.message))
          reject(err)
        }
        dispatch(actions.updateTokens(tokens))
        resolve(tokens)
      })
    })
  }
}

function addTokens (tokens) {
  return dispatch => {
    if (Array.isArray(tokens)) {
      dispatch(actions.setSelectedToken(getTokenAddressFromTokenObject(tokens[0])))
      return Promise.all(tokens.map(({ address, symbol, decimals }) => (
        dispatch(addToken(address, symbol, decimals))
      )))
    } else {
      dispatch(actions.setSelectedToken(getTokenAddressFromTokenObject(tokens)))
      return Promise.all(
        Object
        .entries(tokens)
        .map(([_, { address, symbol, decimals }]) => (
          dispatch(addToken(address, symbol, decimals))
        ))
      )
    }
  }
}

function removeSuggestedTokens () {
  return (dispatch) => {
    dispatch(actions.showLoadingIndication())
    return new Promise((resolve, reject) => {
      background.removeSuggestedTokens((err, suggestedTokens) => {
        dispatch(actions.hideLoadingIndication())
        if (err) {
          dispatch(actions.displayWarning(err.message))
        }
        dispatch(actions.clearPendingTokens())
        if (global.METAMASK_UI_TYPE === ENVIRONMENT_TYPE_NOTIFICATION) {
          return global.platform.closeCurrentWindow()
        }
        resolve(suggestedTokens)
      })
    })
    .then(() => updateMetamaskStateFromBackground())
    .then(suggestedTokens => dispatch(actions.updateMetamaskState({...suggestedTokens})))
  }
}

function addKnownMethodData (fourBytePrefix, methodData) {
  return (dispatch) => {
    background.addKnownMethodData(fourBytePrefix, methodData)
  }
}

function updateTokens (newTokens) {
  return {
    type: actions.UPDATE_TOKENS,
    newTokens,
  }
}

function goBackToInitView () {
  return {
    type: actions.BACK_TO_INIT_MENU,
  }
}

//
// notice
//

function markNoticeRead (notice) {
  return (dispatch) => {
    dispatch(actions.showLoadingIndication())
    log.debug(`background.markNoticeRead`)
    return new Promise((resolve, reject) => {
      background.markNoticeRead(notice, (err, notice) => {
        dispatch(actions.hideLoadingIndication())
        if (err) {
          dispatch(actions.displayWarning(err.message))
          return reject(err)
        }

        if (notice) {
          dispatch(actions.showNotice(notice))
          resolve(true)
        } else {
          dispatch(actions.clearNotices())
          resolve(false)
        }
      })
    })
  }
}

function showNotice (notice) {
  return {
    type: actions.SHOW_NOTICE,
    value: notice,
  }
}

function clearNotices () {
  return {
    type: actions.CLEAR_NOTICES,
  }
}

function markAccountsFound () {
  log.debug(`background.markAccountsFound`)
  return callBackgroundThenUpdate(background.markAccountsFound)
}

function retryTransaction (txId, gasPrice) {
  log.debug(`background.retryTransaction`)
  let newTxId

  return dispatch => {
    return new Promise((resolve, reject) => {
      background.retryTransaction(txId, gasPrice, (err, newState) => {
        if (err) {
          dispatch(actions.displayWarning(err.message))
          reject(err)
        }

        const { selectedAddressTxList } = newState
        const { id } = selectedAddressTxList[selectedAddressTxList.length - 1]
        newTxId = id
        resolve(newState)
      })
    })
      .then(newState => dispatch(actions.updateMetamaskState(newState)))
      .then(() => newTxId)
  }
}

function createCancelTransaction (txId, customGasPrice) {
  log.debug('background.cancelTransaction')
  let newTxId

  return dispatch => {
    return new Promise((resolve, reject) => {
      background.createCancelTransaction(txId, customGasPrice, (err, newState) => {
        if (err) {
          dispatch(actions.displayWarning(err.message))
          reject(err)
        }

        const { selectedAddressTxList } = newState
        const { id } = selectedAddressTxList[selectedAddressTxList.length - 1]
        newTxId = id
        resolve(newState)
      })
    })
    .then(newState => dispatch(actions.updateMetamaskState(newState)))
    .then(() => newTxId)
  }
}

function createSpeedUpTransaction (txId, customGasPrice) {
  log.debug('background.createSpeedUpTransaction')
  let newTx

  return dispatch => {
    return new Promise((resolve, reject) => {
      background.createSpeedUpTransaction(txId, customGasPrice, (err, newState) => {
        if (err) {
          dispatch(actions.displayWarning(err.message))
          reject(err)
        }

        const { selectedAddressTxList } = newState
        newTx = selectedAddressTxList[selectedAddressTxList.length - 1]
        resolve(newState)
      })
    })
    .then(newState => dispatch(actions.updateMetamaskState(newState)))
    .then(() => newTx)
  }
}

//
// config
//

function setProviderType (type) {
  return (dispatch, getState) => {
    const { type: currentProviderType } = getState().metamask.provider
    log.debug(`background.setProviderType`, type)
    background.setProviderType(type, (err, result) => {
      if (err) {
        log.error(err)
        return dispatch(actions.displayWarning('Had a problem changing networks!'))
      }
      dispatch(setPreviousProvider(currentProviderType))
      dispatch(actions.updateProviderType(type))
      dispatch(actions.setSelectedToken())
    })

  }
}

function updateProviderType (type) {
  return {
    type: actions.SET_PROVIDER_TYPE,
    value: type,
  }
}

function setPreviousProvider (type) {
  return {
    type: actions.SET_PREVIOUS_PROVIDER,
    value: type,
  }
}

function updateAndSetCustomRpc (newRpc, chainId, ticker = 'ETH', nickname) {
  return (dispatch) => {
    log.debug(`background.updateAndSetCustomRpc: ${newRpc} ${chainId} ${ticker} ${nickname}`)
    background.updateAndSetCustomRpc(newRpc, chainId, ticker, nickname || newRpc, (err, result) => {
      if (err) {
        log.error(err)
        return dispatch(actions.displayWarning('Had a problem changing networks!'))
      }
      dispatch({
        type: actions.SET_RPC_TARGET,
        value: newRpc,
      })
    })
  }
}

// Calls the addressBookController to add a new address.
function addToAddressBook (recipient, nickname = '') {
  log.debug(`background.addToAddressBook`)
  return (dispatch) => {
    background.setAddressBook(recipient, nickname, (err, result) => {
      if (err) {
        log.error(err)
        return dispatch(self.displayWarning('Address book failed to update'))
      }
    })
  }
}

function useEtherscanProvider () {
  log.debug(`background.useEtherscanProvider`)
  background.useEtherscanProvider()
  return {
    type: actions.USE_ETHERSCAN_PROVIDER,
  }
}

function showModal (payload) {
  return {
    type: actions.MODAL_OPEN,
    payload,
  }
}

function hideModal (payload) {
  return {
    type: actions.MODAL_CLOSE,
    payload,
  }
}

function showSidebar ({ transitionName, type, props }) {
  return {
    type: actions.SIDEBAR_OPEN,
    value: {
      transitionName,
      type,
      props,
    },
  }
}

function hideSidebar () {
  return {
    type: actions.SIDEBAR_CLOSE,
  }
}

function showAlert (msg) {
  return {
    type: actions.ALERT_OPEN,
    value: msg,
  }
}

function hideAlert () {
  return {
    type: actions.ALERT_CLOSE,
  }
}

/**
 * This action will receive two types of values via qrCodeData
 * an object with the following structure {type, values}
 * or null (used to clear the previous value)
 */
function qrCodeDetected (qrCodeData) {
  return {
    type: actions.QR_CODE_DETECTED,
    value: qrCodeData,
  }
}

function showLoadingIndication (message) {
  return {
    type: actions.SHOW_LOADING,
    value: message,
  }
}

function hideLoadingIndication () {
  return {
    type: actions.HIDE_LOADING,
  }
}

function showSubLoadingIndication () {
  return {
    type: actions.SHOW_SUB_LOADING_INDICATION,
  }
}

function hideSubLoadingIndication () {
  return {
    type: actions.HIDE_SUB_LOADING_INDICATION,
  }
}

function displayWarning (text) {
  return {
    type: actions.DISPLAY_WARNING,
    value: text,
  }
}

function hideWarning () {
  return {
    type: actions.HIDE_WARNING,
  }
}

function requestExportAccount () {
  return {
    type: actions.REQUEST_ACCOUNT_EXPORT,
  }
}

function exportAccount (password, address) {
  var self = this

  return function (dispatch) {
    dispatch(self.showLoadingIndication())
    log.debug(`background.submitPassword`)
    return new Promise((resolve, reject) => {
      let inst = new JingchangWallet(JingchangWallet.get(), true, false)
      inst.getSecretWithAddress(password, address).then((secret) => {
        dispatch(self.showPrivateKey(secret))
        return resolve(secret)
    }).catch((err) => {
      log.error('Error in submiting password.')
          dispatch(self.hideLoadingIndication())
          dispatch(self.displayWarning('Incorrect Password.'))
          return reject(err)
  })
    })
  }
}

function exportAccountComplete () {
  return {
    type: actions.EXPORT_ACCOUNT,
  }
}

function showPrivateKey (key) {
  return {
    type: actions.SHOW_PRIVATE_KEY,
    value: key,
  }
}

function setAccountLabel (account, label) {
  return (dispatch) => {
    dispatch(actions.showLoadingIndication())
    log.debug(`background.setAccountLabel`)
    return new Promise((resolve, reject) => {
      background.setAccountLabel(account, label, (err) => {
        dispatch(actions.hideLoadingIndication())

        if (err) {
          dispatch(actions.displayWarning(err.message))
          reject(err)
        }

        dispatch({
          type: actions.SET_ACCOUNT_LABEL,
          value: { account, label },
        })

        resolve(account)
      })
    })
  }
}

function showSendPage () {
  return {
    type: actions.SHOW_SEND_PAGE,
  }
}

function showSendTokenPage () {
  return {
    type: actions.SHOW_SEND_TOKEN_PAGE,
  }
}

function onboardingBuyEthView (address) {
  return {
    type: actions.ONBOARDING_BUY_ETH_VIEW,
    value: address,
  }
}

function buyEthView (address) {
  return {
    type: actions.BUY_ETH_VIEW,
    value: address,
  }
}

function coinBaseSubview () {
  return {
    type: actions.COINBASE_SUBVIEW,
  }
}

function pairUpdate (coin) {
  return (dispatch) => {
    dispatch(actions.showSubLoadingIndication())
    dispatch(actions.hideWarning())
    shapeShiftRequest('marketinfo', {pair: `${coin.toLowerCase()}_eth`}, (mktResponse) => {
      dispatch(actions.hideSubLoadingIndication())
      if (mktResponse.error) return dispatch(actions.displayWarning(mktResponse.error))
      dispatch({
        type: actions.PAIR_UPDATE,
        value: {
          marketinfo: mktResponse,
        },
      })
    })
  }
}

function shapeShiftSubview (network) {
  var pair = 'btc_eth'
  return (dispatch) => {
    dispatch(actions.showSubLoadingIndication())
    shapeShiftRequest('marketinfo', {pair}, (mktResponse) => {
      shapeShiftRequest('getcoins', {}, (response) => {
        dispatch(actions.hideSubLoadingIndication())
        if (mktResponse.error) return dispatch(actions.displayWarning(mktResponse.error))
        dispatch({
          type: actions.SHAPESHIFT_SUBVIEW,
          value: {
            marketinfo: mktResponse,
            coinOptions: response,
          },
        })
      })
    })
  }
}

function coinShiftRquest (data, marketData) {
  return (dispatch) => {
    dispatch(actions.showLoadingIndication())
    shapeShiftRequest('shift', { method: 'POST', data}, (response) => {
      dispatch(actions.hideLoadingIndication())
      if (response.error) return dispatch(actions.displayWarning(response.error))
      var message = `
        Deposit your ${response.depositType} to the address below:`
      log.debug(`background.createShapeShiftTx`)
      background.createShapeShiftTx(response.deposit, response.depositType)
      dispatch(actions.showQrView(response.deposit, [message].concat(marketData)))
    })
  }
}

function buyWithShapeShift (data) {
  return dispatch => new Promise((resolve, reject) => {
    shapeShiftRequest('shift', { method: 'POST', data}, (response) => {
      if (response.error) {
        return reject(response.error)
      }
      background.createShapeShiftTx(response.deposit, response.depositType)
      return resolve(response)
    })
  })
}

function showQrView (data, message) {
  return {
    type: actions.SHOW_QR_VIEW,
    value: {
      message: message,
      data: data,
    },
  }
}
function reshowQrCode (data, coin) {
  return (dispatch) => {
    dispatch(actions.showLoadingIndication())
    shapeShiftRequest('marketinfo', {pair: `${coin.toLowerCase()}_eth`}, (mktResponse) => {
      if (mktResponse.error) return dispatch(actions.displayWarning(mktResponse.error))

      var message = [
        `Deposit your ${coin} to the address below:`,
        `Deposit Limit: ${mktResponse.limit}`,
        `Deposit Minimum:${mktResponse.minimum}`,
      ]

      dispatch(actions.hideLoadingIndication())
      return dispatch(actions.showQrView(data, message))
      // return dispatch(actions.showModal({
      //   name: 'SHAPESHIFT_DEPOSIT_TX',
      //   Qr: { data, message },
      // }))
    })
  }
}

function shapeShiftRequest (query, options, cb) {
  var queryResponse, method
  !options ? options = {} : null
  options.method ? method = options.method : method = 'GET'

  var requestListner = function (request) {
    try {
      queryResponse = JSON.parse(this.responseText)
      cb ? cb(queryResponse) : null
      return queryResponse
    } catch (e) {
      cb ? cb({error: e}) : null
      return e
    }
  }

  var shapShiftReq = new XMLHttpRequest()
  shapShiftReq.addEventListener('load', requestListner)
  shapShiftReq.open(method, `https://shapeshift.io/${query}/${options.pair ? options.pair : ''}`, true)

  if (options.method === 'POST') {
    var jsonObj = JSON.stringify(options.data)
    shapShiftReq.setRequestHeader('Content-Type', 'application/json')
    return shapShiftReq.send(jsonObj)
  } else {
    return shapShiftReq.send()
  }
}

function setFeatureFlag (feature, activated, notificationType) {
  return (dispatch) => {
    dispatch(actions.showLoadingIndication())
    return new Promise((resolve, reject) => {
      background.setFeatureFlag(feature, activated, (err, updatedFeatureFlags) => {
        dispatch(actions.hideLoadingIndication())
        if (err) {
          dispatch(actions.displayWarning(err.message))
          return reject(err)
        }
        dispatch(actions.updateFeatureFlags(updatedFeatureFlags))
        notificationType && dispatch(actions.showModal({ name: notificationType }))
        resolve(updatedFeatureFlags)
      })
    })
  }
}

function updateFeatureFlags (updatedFeatureFlags) {
  return {
    type: actions.UPDATE_FEATURE_FLAGS,
    value: updatedFeatureFlags,
  }
}

function setPreference (preference, value) {
  return dispatch => {
    dispatch(actions.showLoadingIndication())
    return new Promise((resolve, reject) => {
      background.setPreference(preference, value, (err, updatedPreferences) => {
        dispatch(actions.hideLoadingIndication())

        if (err) {
          dispatch(actions.displayWarning(err.message))
          return reject(err)
        }

        dispatch(actions.updatePreferences(updatedPreferences))
        resolve(updatedPreferences)
      })
    })
  }
}

function updatePreferences (value) {
  return {
    type: actions.UPDATE_PREFERENCES,
    value,
  }
}

function setUseNativeCurrencyAsPrimaryCurrencyPreference (value) {
  return setPreference('useNativeCurrencyAsPrimaryCurrency', value)
}

function setShowFiatConversionOnTestnetsPreference (value) {
  return setPreference('showFiatInTestnets', value)
}

function setCompletedOnboarding () {
  return dispatch => {
    dispatch(actions.showLoadingIndication())
    return new Promise((resolve, reject) => {
      background.completeOnboarding(err => {
        dispatch(actions.hideLoadingIndication())
        if (err) {
          dispatch(actions.displayWarning(err.message))
          return reject(err)
        }
        dispatch(actions.completeOnboarding())
        resolve()
      })
    })
  }
}

function completeOnboarding () {
  return {
    type: actions.COMPLETE_ONBOARDING,
  }
}

function setCompletedUiMigration () {
  return dispatch => {
    dispatch(actions.showLoadingIndication())
    return new Promise((resolve, reject) => {
      background.completeUiMigration(err => {
        dispatch(actions.hideLoadingIndication())

        if (err) {
          dispatch(actions.displayWarning(err.message))
          return reject(err)
        }

        dispatch(actions.completeUiMigration())
        resolve()
      })
    })
  }
}

function completeUiMigration () {
  return {
    type: actions.COMPLETE_UI_MIGRATION,
  }
}


function setMouseUserState (isMouseUser) {
  return {
    type: actions.SET_MOUSE_USER_STATE,
    value: isMouseUser,
  }
}

// Call Background Then Update
//
// A function generator for a common pattern wherein:
// We show loading indication.
// We call a background method.
// We hide loading indication.
// If it errored, we show a warning.
// If it didn't, we update the state.
function callBackgroundThenUpdateNoSpinner (method, ...args) {
  return (dispatch) => {
    method.call(background, ...args, (err) => {
      if (err) {
        return dispatch(actions.displayWarning(err.message))
      }
      forceUpdateMetamaskState(dispatch)
    })
  }
}

function callBackgroundThenUpdate (method, ...args) {
  return (dispatch) => {
    dispatch(actions.showLoadingIndication())
    method.call(background, ...args, (err) => {
      dispatch(actions.hideLoadingIndication())
      if (err) {
        return dispatch(actions.displayWarning(err.message))
      }
      forceUpdateMetamaskState(dispatch)
    })
  }
}

function forceUpdateMetamaskState (dispatch) {
  log.debug(`background.getState`)
  return new Promise((resolve, reject) => {
    background.getState((err, newState) => {
      if (err) {
        dispatch(actions.displayWarning(err.message))
        return reject(err)
      }

      dispatch(actions.updateMetamaskState(newState))
      resolve(newState)
    })
  })
}

function toggleAccountMenu () {
  return {
    type: actions.TOGGLE_ACCOUNT_MENU,
  }
}

function setImportAccountMode(type) {
  return {
    type: actions.SETIMPORTMODE,
    value:type
  }
}


function toggleNetworkMenu() {
  return {
    type: actions.TOGGLE_NETWORK_MENU,
  }
}




//从store中读取钱包列表 存入 state 
function getWalletsByType(type){
  return (dispatch) => {
    background.getWallets()
  }
}

//实际上是设定 默认‘帐号’ 类似威链钱包的逻辑，仅仅和导出 相关
function setDefaultAccount(wallet){
  return (dispatch) => {
    dispatch(actions.setChainType(walelt.type))
  }
}
//设定 主页面显示的钱包
//包含了 链的设定
function setCurrentWallet(wallet){
  return (dispatch) => {
    //切换 链的状态
    dispatch(actions.setChainType(walelt.type))
    //设定当前钱包
    background.setCurrentWallet(wallet)
  }
}

function setChainType(type){
  return  {
    type: actions.SET_CHAIN_TYPE,
    value: type,
  }
}

function setSelectedWalletType(type){
  return {
    type: actions.SET_SELECTED_WALLET_TYPE,
    value:type,
  }
}


function setMetaMetricsSendCount (val) {
  return (dispatch) => {
    log.debug(`background.setMetaMetricsSendCount`)
    return new Promise((resolve, reject) => {
      background.setMetaMetricsSendCount(val, (err) => {
        if (err) {
          dispatch(actions.displayWarning(err.message))
          return reject(err)
        }

        dispatch({
          type: actions.SET_METAMETRICS_SEND_COUNT,
          value: val,
        })

        resolve(val)
      })
    })
  }
}

function setUseBlockie (val) {
  return (dispatch) => {
    dispatch(actions.showLoadingIndication())
    log.debug(`background.setUseBlockie`)
    background.setUseBlockie(val, (err) => {
      dispatch(actions.hideLoadingIndication())
      if (err) {
        return dispatch(actions.displayWarning(err.message))
      }
    })
    dispatch({
      type: actions.SET_USE_BLOCKIE,
      value: val,
    })
  }
}

function updateCurrentLocale (key) {
  return (dispatch) => {
    dispatch(actions.showLoadingIndication())
    return fetchLocale(key)
      .then((localeMessages) => {
        log.debug(`background.setCurrentLocale`)
        background.setCurrentLocale(key, (err) => {
          dispatch(actions.hideLoadingIndication())
          if (err) {
            return dispatch(actions.displayWarning(err.message))
          }
          dispatch(actions.setCurrentLocale(key))
          dispatch(actions.setLocaleMessages(localeMessages))
        })
      })
  }
}

function setCurrentLocale (key) {
  return {
    type: actions.SET_CURRENT_LOCALE,
    value: key,
  }
}

function setLocaleMessages (localeMessages) {
  return {
    type: actions.SET_LOCALE_MESSAGES,
    value: localeMessages,
  }
}


function approveProviderRequest (tabID) {
  return (dispatch) => {
    background.approveProviderRequest(tabID)
  }
}

function rejectProviderRequest (tabID) {
  return (dispatch) => {
    background.rejectProviderRequest(tabID)
  }
}

function clearApprovedOrigins () {
  return (dispatch) => {
    background.clearApprovedOrigins()
  }
}

function setFirstTimeFlowType (type) {
  return (dispatch) => {
    log.debug(`background.setFirstTimeFlowType`)
    background.setFirstTimeFlowType(type, (err) => {
      if (err) {
        return dispatch(actions.displayWarning(err.message))
      }
    })
    dispatch({
      type: actions.SET_FIRST_TIME_FLOW_TYPE,
      value: type,
    })
  }
}