const inherits = require('util').inherits
const Component = require('react').Component
const h = require('react-hyperscript')
const connect = require('react-redux').connect
const { withRouter } = require('react-router-dom')
const { compose } = require('recompose')
const actions = require('./actions')
const log = require('loglevel')
const R = require('ramda')

const SignatureRequest = require('./components/signature-request')
const Loading = require('./components/loading-screen')
const { DEFAULT_ROUTE } = require('./routes')
const { getMetaMaskAccounts } = require('./selectors')

module.exports = compose(
  withRouter,
  connect(mapStateToProps)
)(ConfirmTxScreen)

function mapStateToProps (state) {

  return {
    identities: state.metamask.identities,
    accounts: getMetaMaskAccounts(state),
    selectedAddress: state.metamask.selectedAddress,
    index: state.appState.currentView.context,
    warning: state.appState.warning,
    provider: state.metamask.provider,
    currentCurrency: state.metamask.currentCurrency,
    computedBalances: state.metamask.computedBalances,
    send: state.metamask.send,
    selectedAddressTxList: state.metamask.selectedAddressTxList,
  }
}

inherits(ConfirmTxScreen, Component)
function ConfirmTxScreen () {
  Component.call(this)
}

ConfirmTxScreen.prototype.componentDidMount = function () {
  const {
    send,
  } = this.props
}

ConfirmTxScreen.prototype.componentDidUpdate = function (prevProps) {
  const {
    selectedAddressTxList,
    send,
    history,
    match: { params: { id: transactionId } = {} },
  } = this.props

  let prevTx

  if (transactionId) {
    prevTx = R.find(({ id }) => id + '' === transactionId)(selectedAddressTxList)
  } else {
    const { index: prevIndex } = prevProps
    const prevTxData = {}
    prevTx = selectedAddressTxList.find(({ id }) => id === prevTxData.id) || {}
  }

  if (prevTx && prevTx.status === 'dropped') {
    this.props.dispatch(actions.showModal({
      name: 'TRANSACTION_CONFIRMED',
      onSubmit: () => history.push(DEFAULT_ROUTE),
    }))

    return
  }
}

ConfirmTxScreen.prototype.render = function () {
  const props = this.props
  const {
    currentCurrency,
    conversionRate,
    blockGasLimit,
  } = props

  var txData = this.getTxData() || {}
  const { msgParams } = txData
  log.debug('msgParams detected, rendering pending msg')

  return msgParams
    ? h(SignatureRequest, {
      // Properties
      txData: txData,
      key: txData.id,
      selectedAddress: props.selectedAddress,
      accounts: props.accounts,
      identities: props.identities,
      conversionRate,
      currentCurrency,
      blockGasLimit,
      // Actions
      signMessage: this.signMessage.bind(this, txData),
      signPersonalMessage: this.signPersonalMessage.bind(this, txData),
      signTypedMessage: this.signTypedMessage.bind(this, txData),
      cancelMessage: this.cancelMessage.bind(this, txData),
      cancelPersonalMessage: this.cancelPersonalMessage.bind(this, txData),
      cancelTypedMessage: this.cancelTypedMessage.bind(this, txData),
    })
    : h(Loading)
}

ConfirmTxScreen.prototype.signMessage = function (msgData, event) {
  log.info('conf-tx.js: signing message')
  var params = msgData.msgParams
  params.metamaskId = msgData.id
  this.stopPropagation(event)
  return this.props.dispatch(actions.signMsg(params))
}

ConfirmTxScreen.prototype.stopPropagation = function (event) {
  if (event.stopPropagation) {
    event.stopPropagation()
  }
}

ConfirmTxScreen.prototype.signTypedMessage = function (msgData, event) {
  log.info('conf-tx.js: signing typed message')
  var params = msgData.msgParams
  params.metamaskId = msgData.id
  this.stopPropagation(event)
  return this.props.dispatch(actions.signTypedMsg(params))
}

ConfirmTxScreen.prototype.cancelMessage = function (msgData, event) {
  log.info('canceling message')
  this.stopPropagation(event)
  return this.props.dispatch(actions.cancelMsg(msgData))
}

ConfirmTxScreen.prototype.cancelTypedMessage = function (msgData, event) {
  log.info('canceling typed message')
  this.stopPropagation(event)
  return this.props.dispatch(actions.cancelTypedMsg(msgData))
}
