
const abi = require('human-standard-token-abi')
const {
  multiplyCurrencies,
} = require('./conversion-util')
const Jccutils = require('./components/send/jccutils')

const selectors = {
  getSelectedAddressTransaction,
  getSelectedAddress,
  getSelectedIdentity,
  getSelectedAccount,
  getSelectedToken,
  getSelectedTokenExchangeRate,
  getSelectedTokenAssetImage,
  getAssetImages,
  getTokenExchangeRate,
  conversionRateSelector,
  accountsWithSendEtherInfoSelector,
  getCurrentAccountWithSendEtherInfo,
  getSendFrom,
  getCurrentCurrency,
  getNativeCurrency,
  getSendAmount,
 // getSelectedTokenToFiatRate,
  getSelectedTokenContract,
  getSendMaxModeState,
  getCurrentViewContext,
  getTotalUnapprovedCount,
  preferencesSelector,
  getMetaMaskAccounts,
  getSelectedAsset,
  getAccountType,
  getNumberOfAccounts,
  getNumberOfTokens,
  getSelectedAddressTokens,
}

module.exports = selectors


function getAccountType (state) {

  const type = 'Simple Key Pair'

  switch (type) {
    case 'Simple Key Pair':
      return 'imported'
    default:
      return 'default'
  }
}

function getSelectedAsset (state) {
  return getSelectedToken(state)
}

function getSelectedAddress (state) {
//  const selectedAddress = state.metamask.selectedAddress || Object.keys(getMetaMaskAccounts(state))[0]
const selectedAddress = state.metamask.selectedAddress
  return selectedAddress
}

function getSelectedAddressTokens (state) {
  //  const selectedAddress = state.metamask.selectedAddress || Object.keys(getMetaMaskAccounts(state))[0]
  const selectedAddress = state.metamask.selectedAddress
  const accountsTokenBal = state.metamask.accountsTokenBal
  const selectedAddressTokens = []
  if (selectedAddress && accountsTokenBal[selectedAddress]) {
    return accountsTokenBal[selectedAddress]
  } else {
    return selectedAddressTokens
  }
  }

function getSelectedAddressTransaction (state) {
  const jccutils = new Jccutils()
  const selectedAddress = state.metamask.selectedAddress
  let transactions = []
  jccutils.getHistoricPayments(selectedAddress).then((res) => {
    if (res.result) {
      transactions = res.data.transactions
    }
  })
    return transactions
  }

function getSelectedIdentity (state) {
  const selectedAddress = getSelectedAddress(state)
  const identities = state.metamask.identities

  return identities[selectedAddress]
}

function getNumberOfAccounts (state) {
  return Object.keys(state.metamask.accounts).length
}

function getNumberOfTokens (state) {
  const tokens = state.metamask.tokens
  return tokens ? tokens.length : 0
}

function getMetaMaskAccounts (state) {
  const currentAccounts = state.metamask.accounts
  const selectedAccounts = {}

  Object.keys(currentAccounts).forEach(accountID => {
    const account = currentAccounts[accountID]
    if (account && account.balance === null || account.balance === undefined) {
      selectedAccounts[accountID] = {
      }
    } else {
      selectedAccounts[accountID] = account
    }
  })
  return selectedAccounts
}


function getSelectedAccount (state) {
  const accounts = getMetaMaskAccounts(state)
  const selectedAddress = getSelectedAddress(state)

  return accounts[selectedAddress]
}

function getSelectedToken (state) {
  const tokens = state.metamask.tokens || []
  const selectedTokenAddress = state.metamask.selectedTokenAddress
  const selectedToken = tokens.filter(({ address }) => address === selectedTokenAddress)[0]
  const sendToken = state.metamask.send.token

  return selectedToken || sendToken || null
}

function getSelectedTokenExchangeRate (state) {
  const contractExchangeRates = state.metamask.contractExchangeRates
  const selectedToken = getSelectedToken(state) || {}
  const { address } = selectedToken
  return contractExchangeRates[address] || 0
}

function getSelectedTokenAssetImage (state) {
  const assetImages = state.metamask.assetImages || {}
  const selectedToken = getSelectedToken(state) || {}
  const { address } = selectedToken
  return assetImages[address]
}

function getAssetImages (state) {
  const assetImages = state.metamask.assetImages || {}
  return assetImages
}

function getTokenExchangeRate (state, address) {
  const contractExchangeRates = state.metamask.contractExchangeRates
  return contractExchangeRates[address] || 0
}

function conversionRateSelector (state) {
  return state.metamask.conversionRate
}


function accountsWithSendEtherInfoSelector (state) {
  const accounts = getMetaMaskAccounts(state)
  const { identities } = state.metamask

  const accountsWithSendEtherInfo = Object.entries(accounts).map(([key, account]) => {
    return Object.assign({}, account, identities[key])
  })

  return accountsWithSendEtherInfo
}

function getCurrentAccountWithSendEtherInfo (state) {
  const currentAddress = getSelectedAddress(state)
  const accounts = accountsWithSendEtherInfoSelector(state)

  return accounts.find(({ address }) => address === currentAddress)
}


function getSendFrom (state) {
  return state.metamask.send.from
}

function getSendAmount (state) {
  return state.metamask.send.amount
}

function getSendMaxModeState (state) {
  return state.metamask.send.maxModeOn
}

function getCurrentCurrency (state) {
  return state.metamask.currentCurrency
}

function getNativeCurrency (state) {
  return state.metamask.nativeCurrency
}

function getSelectedTokenContract (state) {
  const selectedToken = getSelectedToken(state)
  return selectedToken
    ? global.eth.contract(abi).at(selectedToken.address)
    : null
}

function getCurrentViewContext (state) {
  const { currentView = {} } = state.appState
  return currentView.context
}

function getTotalUnapprovedCount ({ metamask }) {
  const {
    unapprovedTxs = {},
    unapprovedMsgCount,
    unapprovedPersonalMsgCount,
    unapprovedTypedMessagesCount,
  } = metamask

  return Object.keys(unapprovedTxs).length + unapprovedMsgCount + unapprovedPersonalMsgCount +
    unapprovedTypedMessagesCount
}


function preferencesSelector ({ metamask }) {
  return metamask.preferences
}

