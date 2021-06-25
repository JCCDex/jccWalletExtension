const extend = require('xtend')
const actions = require('../actions')
const { getEnvironmentType } = require('../../../app/scripts/lib/util')
const { ENVIRONMENT_TYPE_POPUP } = require('../../../app/scripts/lib/enums')


module.exports = reduceMetamask

function reduceMetamask (state, action) {
  let newState

  // clone + defaults
  var metamaskState = extend({
    isInitialized: false,
    isUnlocked: false,
    isAccountMenuOpen: false,
    isNetworkMenuOpen:false,
    isPopup: getEnvironmentType(window.location.href) === ENVIRONMENT_TYPE_POPUP,
    rpcTarget: 'https://rawtestrpc.metamask.io/',
    identities: {},
    accountPwd: {},
    unapprovedTxs: {},
    manageWalletType:"jingtum",
    noActiveNotices: true,
    nextUnreadNotice: undefined,
    frequentRpcList: [],
    addressBook: [],
    selectedTokenAddress: null,
    selectedWalletType:'',
    wallets: {},
    
    networks:{},

    selectedNetWork:{},
    contractExchangeRates: {},
    tokenExchangeRates: {},
    tokens: [],
    pendingTokens: {},
    send: {
      tokenBalance: '0x0',
      from: '',
      to: '',
      amount: '0',
      memo: '',
      errors: {},
      maxModeOn: false,
      toNickname: '',
    },
    order: {
      amount: '0',
      direction: '',
      price: '0',
      counter: '',
      base: '',
      password: '',
      from: '',
    },
    coinOptions: {},
    useBlockie: false,
    featureFlags: {},
    isRevealingSeedWords: false,
    welcomeScreenSeen: false,
    currentLocale: '',
    importMode:'secret',
    preferences: {
      useNativeCurrencyAsPrimaryCurrency: true,
      showFiatInTestnets: false,
    },
    firstTimeFlowType: null,
    completedOnboarding: false,
    knownMethodData: {},
    participateInMetaMetrics: null,
    metaMetricsSendCount: 0,
  }, state.metamask)


  let temp = {};
  let walletsTemp = {};

  switch (action.type) {

    case actions.SHOW_ACCOUNTS_PAGE:
      newState = extend(metamaskState, {
        isRevealingSeedWords: false,
      })
      delete newState.seedWords
      return newState

    case actions.SHOW_NOTICE:
      return extend(metamaskState, {
        noActiveNotices: false,
        nextUnreadNotice: action.value,
      })

    case actions.CLEAR_NOTICES:
      return extend(metamaskState, {
        noActiveNotices: true,
        nextUnreadNotice: undefined,
      })

    case actions.UPDATE_METAMASK_STATE:
      return extend(metamaskState, action.value)

    case actions.UNLOCK_METAMASK:
      return extend(metamaskState, {
        isUnlocked: true,
        isInitialized: true,
        selectedAddress: action.value,
      })

    case actions.LOCK_METAMASK:
      return extend(metamaskState, {
        isUnlocked: false,
      })

    case actions.SET_RPC_LIST:
      return extend(metamaskState, {
        frequentRpcList: action.value,
      })

    case actions.SET_RPC_TARGET:
      return extend(metamaskState, {
        provider: {
          type: 'rpc',
          rpcTarget: action.value,
        },
      })

    case actions.SET_PROVIDER_TYPE:
      return extend(metamaskState, {
        provider: {
          type: action.value,
        },
      })

    case actions.COMPLETED_TX:
      var stringId = String(action.id)
      newState = extend(metamaskState, {
        unapprovedTxs: {},
        unapprovedMsgs: {},
      })
      for (const id in metamaskState.unapprovedTxs) {
        if (id !== stringId) {
          newState.unapprovedTxs[id] = metamaskState.unapprovedTxs[id]
        }
      }
      for (const id in metamaskState.unapprovedMsgs) {
        if (id !== stringId) {
          newState.unapprovedMsgs[id] = metamaskState.unapprovedMsgs[id]
        }
      }
      return newState

    case actions.SHOW_NEW_VAULT_SEED:
      return extend(metamaskState, {
        isRevealingSeedWords: true,
        seedWords: action.value,
      })

    case actions.CLEAR_SEED_WORD_CACHE:
      newState = extend(metamaskState, {
        isUnlocked: true,
        isInitialized: true,
        selectedAddress: action.value,
      })
      delete newState.seedWords
      return newState

    case actions.SHOW_ACCOUNT_DETAIL:
      newState = extend(metamaskState, {
        isUnlocked: true,
        isInitialized: true,
        selectedAddress: action.value,
      })
      delete newState.seedWords
      return newState

    case actions.SET_SELECTED_TOKEN:
      return extend(metamaskState, {
        selectedTokenAddress: action.value,
      })

    case actions.SET_ACCOUNT_LABEL:
      const account = action.value.account
      const type = action.value.walletType
      const name = action.value.name
      const id = {}
      id[account] = extend(metamaskState.identities[account], { name ,type})
      const identities = extend(metamaskState.identities, id)
      return extend(metamaskState, { identities })
  
    case actions.SET_CURRENT_FIAT:
      return extend(metamaskState, {
        currentCurrency: action.value.currentCurrency,
        conversionRate: action.value.conversionRate,
        conversionDate: action.value.conversionDate,
      })
    case actions.SET_MANAGE_WALLET_TYPE:
      return extend(metamaskState,{
        manageWalletType: action.value,
      })
    
    case actions.SET_NETWORK:
      const selectedNetWork = metamaskState.selectedNetWork
      //action.value.network
      selectedNetWork[action.value.type] = {name:"1234","url":"##########"}

      console.log(selectedNetWork)

      return extend(metamaskState,{selectedNetWork})
        
    case actions.UPDATE_TOKENS:
      return extend(metamaskState, {
        tokens: action.newTokens,
      })

    // metamask.send
    case actions.UPDATE_GAS_LIMIT:
      return extend(metamaskState, {
        send: {
          ...metamaskState.send,
          gasLimit: action.value,
        },
      })

    case actions.UPDATE_GAS_PRICE:
      return extend(metamaskState, {
        send: {
          ...metamaskState.send,
          gasPrice: action.value,
        },
      })

    case actions.TOGGLE_ACCOUNT_MENU:
      return extend(metamaskState, {
        isAccountMenuOpen: !metamaskState.isAccountMenuOpen,
      })

    case actions.UPDATE_GAS_TOTAL:
      return extend(metamaskState, {
        send: {
          ...metamaskState.send,
          gasTotal: action.value,
        },
      })

    case actions.UPDATE_SEND_TOKEN_BALANCE:
      return extend(metamaskState, {
        send: {
          ...metamaskState.send,
          tokenBalance: action.value,
        },
      })

    case actions.UPDATE_SEND_HEX_DATA:
      return extend(metamaskState, {
        send: {
          ...metamaskState.send,
          data: action.value,
        },
      })

    case actions.UPDATE_SEND_FROM:
      return extend(metamaskState, {
        send: {
          ...metamaskState.send,
          from: action.value,
        },
      })

    case actions.UPDATE_SEND_TO:
      return extend(metamaskState, {
        send: {
          ...metamaskState.send,
          to: action.value.to,
          toNickname: action.value.nickname,
        },
      })


    case actions.UPDATE_SEND_AMOUNT:
      return extend(metamaskState, {
        send: {
          ...metamaskState.send,
          amount: action.value,
        },
      })

      case actions.UPDATE_SEND_CURRENCY:
      return extend(metamaskState, {
        send: {
          ...metamaskState.send,
          sendCur: action.value,
        },
      })

      case actions.UPDATE_COUNTER:
      return extend(metamaskState, {
        order: {
          ...metamaskState.order,
          counter: action.value,
        },
      })

      case actions.UPDATE_DIRECTION:
      return extend(metamaskState, {
        order: {
          ...metamaskState.order,
          direction: action.value,
        },
      })

      case actions.UPDATE_ORDER_AMOUNT:
      return extend(metamaskState, {
        order: {
          ...metamaskState.order,
          amount: action.value,
        },
      })

      case actions.UPDATE_ORDER_PRICE:
      return extend(metamaskState, {
        order: {
          ...metamaskState.order,
          price: action.value,
        },
      })

    case actions.UPDATE_SEND_MEMO:
      return extend(metamaskState, {
        send: {
          ...metamaskState.send,
          memo: action.value,
        },
      })

    case actions.UPDATE_MAX_MODE:
      return extend(metamaskState, {
        send: {
          ...metamaskState.send,
          maxModeOn: action.value,
        },
      })

    case actions.UPDATE_SEND:
      return extend(metamaskState, {
        send: {
          ...metamaskState.send,
          ...action.value,
        },
      })

    case actions.CLEAR_SEND:
      return extend(metamaskState, {
        send: {
          gasLimit: null,
          gasPrice: null,
          gasTotal: null,
          tokenBalance: null,
          from: '',
          to: '',
          amount: '0x0',
          memo: '',
          errors: {},
          maxModeOn: false,
          editingTransactionId: null,
          forceGasMin: null,
          toNickname: '',
        },
      })

    case actions.UPDATE_TRANSACTION_PARAMS:
      const { id: txId, value } = action
      let { selectedAddressTxList } = metamaskState
      selectedAddressTxList = selectedAddressTxList.map(tx => {
        if (tx.id === txId) {
          tx.txParams = value
        }
        return tx
      })

      return extend(metamaskState, {
        selectedAddressTxList,
      })

    case actions.PAIR_UPDATE:
      const { value: { marketinfo: pairMarketInfo } } = action
      return extend(metamaskState, {
        tokenExchangeRates: {
          ...metamaskState.tokenExchangeRates,
          [pairMarketInfo.pair]: pairMarketInfo,
        },
      })

    case actions.SHAPESHIFT_SUBVIEW:
      const { value: { marketinfo: ssMarketInfo, coinOptions } } = action
      return extend(metamaskState, {
        tokenExchangeRates: {
          ...metamaskState.tokenExchangeRates,
          [ssMarketInfo.pair]: ssMarketInfo,
        },
        coinOptions,
      })

    case actions.SET_PARTICIPATE_IN_METAMETRICS:
      return extend(metamaskState, {
        participateInMetaMetrics: action.value,
      })

    case actions.SET_METAMETRICS_SEND_COUNT:
      return extend(metamaskState, {
        metaMetricsSendCount: action.value,
      })

    case actions.SET_USE_BLOCKIE:
      return extend(metamaskState, {
        useBlockie: action.value,
      })

    case actions.UPDATE_FEATURE_FLAGS:
      return extend(metamaskState, {
        featureFlags: action.value,
      })

    case actions.CLOSE_WELCOME_SCREEN:
      return extend(metamaskState, {
        welcomeScreenSeen: true,
      })

    case actions.SET_CURRENT_LOCALE:
      return extend(metamaskState, {
        currentLocale: action.value,
      })

    case actions.SETIMPORTMODE:
      return extend(metamaskState,{
        importMode: action.value,
      })

    case actions.TOGGLE_NETWORK_MENU:
      return extend(metamaskState,{
        isNetworkMenuOpen: !metamaskState.isNetworkMenuOpen,
      })

    case actions.SET_SELECTED_WALLET_TYPE:
      return extend(metamaskState, {
        selectedWalletType:action.value
      })
    case actions.SET_PENDING_TOKENS:
      return extend(metamaskState, {
        pendingTokens: { ...action.payload },
      })

    case actions.CLEAR_PENDING_TOKENS: {
      return extend(metamaskState, {
        pendingTokens: {},
      })
    }

    case actions.UPDATE_PREFERENCES: {
      return extend(metamaskState, {
        preferences: {
          ...metamaskState.preferences,
          ...action.payload,
        },
      })
    }

    case actions.COMPLETE_ONBOARDING: {
      return extend(metamaskState, {
        completedOnboarding: true,
      })
    }

    case actions.COMPLETE_UI_MIGRATION: {
      return extend(metamaskState, {
        completedUiMigration: true,
      })
    }

    case actions.SET_FIRST_TIME_FLOW_TYPE: {
      return extend(metamaskState, {
        firstTimeFlowType: action.value,
      })
    }

    default:
      return metamaskState

  }
}
