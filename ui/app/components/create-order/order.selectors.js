const {
  getMetaMaskAccounts,
} = require('../../selectors')

const selectors = {
  getOrderAmount,
  getOrderErrors,
  getOrderDirection,
  getOrderPrice,
  getOrderCounter,
  getOrderBase,
  getOrderPassword,
  getSelectedAddress,
  getSelectedIdentity,
  getOrderWarning,
  getJccSendWarnings,
  getOrderFromObject,
  getAccount,
}

module.exports = selectors

function getSelectedAddress (state) {
  const selectedAddress = state.metamask.selectedAddress || Object.keys(getMetaMaskAccounts(state))[0]

  return selectedAddress
}

function getSelectedIdentity (state) {
  const selectedAddress = getSelectedAddress(state)
  const identities = state.metamask.identities

  return identities[selectedAddress]
}

function getOrderAmount (state) {
  return state.metamask.order.amount
}

function getOrderDirection (state) {
  return state.metamask.order.direction
}

function getOrderPrice (state) {
  return state.metamask.order.price
}

function getOrderErrors (state) {
  return state.order.errors
}

function getOrderWarning (state) {
  return state.order.warning
}

function getOrderCounter (state) {
  return state.metamask.order.counter
}

function getOrderBase (state) {
  return state.metamask.order.base
}

function getOrderPassword (state) {
  return state.metamask.order.password
}


function getOrderWarnings (state) {
  return state.order.warnings
}

function getJccSendWarnings (state) {
  return state.appState.warning
}

function getOrderFrom (state) {
  return state.metamask.order.from
}

function accountsWithSendSwtcInfoSelector (state) {
  const accounts = getMetaMaskAccounts(state)
  const { identities } = state.metamask

  const accountsWithSendEtherInfo = Object.entries(accounts).map(([key, account]) => {
    return Object.assign({}, account, identities[key])
  })

  return accountsWithSendEtherInfo
}

function getSelectedAddress (state) {
  const selectedAddress = state.metamask.selectedAddress || Object.keys(getMetaMaskAccounts(state))[0]

  return selectedAddress
}

function getCurrentAccountWithSendSwtcInfo (state) {
  const currentAddress = getSelectedAddress(state)
  const accounts = accountsWithSendSwtcInfoSelector(state)

  return accounts.find(({ address }) => address === currentAddress)
}

function getOrderFromObject (state) {
  return getOrderFrom(state) || getCurrentAccountWithSendSwtcInfo(state)
}

function getAccount (state) {
  const accounts = getMetaMaskAccounts(state)
  const selectedAddress = getSelectedAddress(state)

  return accounts[selectedAddress]
}

