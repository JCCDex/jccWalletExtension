import { connect } from 'react-redux'
import {
  addToAddressBook,
  clearSend,
  signTx,
} from '../../../actions'
import SendFooter from './send-footer.component'
import {
  getSelectedToken,
  getSendAmount,
  getSendEditingTransactionId,
  getSendFromObject,
  getSendTo,
  getSendToAccounts,
  getSendHexData,
  getTokenBalance,
  getUnapprovedTxs,
  getSendErrors,
  getSendCur,
  getSendMemo,
  getSendWarnings,
  getJccSendWarnings,
} from '../send.selectors'
import {
  isSendFormInError,
} from './send-footer.selectors'

export default connect(mapStateToProps, mapDispatchToProps)(SendFooter)

function mapStateToProps (state) {
  return {
    amount: getSendAmount(state),
    sendCur: getSendCur(state),
    sendMemo: getSendMemo(state),
    data: getSendHexData(state),
    editingTransactionId: getSendEditingTransactionId(state),
    from: getSendFromObject(state),
    inError: isSendFormInError(state),
    selectedToken: getSelectedToken(state),
    to: getSendTo(state),
    toAccounts: getSendToAccounts(state),
    tokenBalance: getTokenBalance(state),
    unapprovedTxs: getUnapprovedTxs(state),
    sendErrors: getSendErrors(state),
    warning: getSendWarnings(state),
    jccWarning: getJccSendWarnings(state),
  //  warning: state.appState.warning,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    clearSend: () => dispatch(clearSend()),
    sign: ({ to, amount, from, password, sendCur, sendMemo }) => {
      const txParams = {
        Flags: 0,
        Fee: 0.00001,
        Account: from,
        TransactionType: 'Payment',
        Amount: {
          value: amount,
          currency: sendCur,
          issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
        },
        Destination: to,
        Memos: [{
          Memo: {
              MemoData: sendMemo
          }
        }],
      }
      console.dir(txParams)
      dispatch(signTx(from, txParams, password))
    },
    addToAddressBookIfNew: (newAddress, toAccounts, nickname = '') => {
      if (addressIsNew(toAccounts)) {
        // TODO: nickname, i.e. addToAddressBook(recipient, nickname)
        dispatch(addToAddressBook(newAddress, nickname))
      }
    },
  }
}
