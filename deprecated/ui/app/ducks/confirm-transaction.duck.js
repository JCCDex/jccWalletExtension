import {
  conversionRateSelector,
  getNativeCurrency,
} from '../selectors/confirm-transaction'

import {
  getValueFromWeiHex,
  addEth,
} from '../helpers/confirm-transaction/util'

// Actions
const createActionType = action => `metamask/confirm-transaction/${action}`

const UPDATE_TX_DATA = createActionType('UPDATE_TX_DATA')
const CLEAR_TX_DATA = createActionType('CLEAR_TX_DATA')
const UPDATE_TOKEN_DATA = createActionType('UPDATE_TOKEN_DATA')
const CLEAR_TOKEN_DATA = createActionType('CLEAR_TOKEN_DATA')
const UPDATE_METHOD_DATA = createActionType('UPDATE_METHOD_DATA')
const CLEAR_METHOD_DATA = createActionType('CLEAR_METHOD_DATA')
const CLEAR_CONFIRM_TRANSACTION = createActionType('CLEAR_CONFIRM_TRANSACTION')
const UPDATE_TRANSACTION_AMOUNTS = createActionType('UPDATE_TRANSACTION_AMOUNTS')
const UPDATE_TRANSACTION_FEES = createActionType('UPDATE_TRANSACTION_FEES')
const UPDATE_TRANSACTION_TOTALS = createActionType('UPDATE_TRANSACTION_TOTALS')
const UPDATE_TOKEN_PROPS = createActionType('UPDATE_TOKEN_PROPS')
const FETCH_DATA_START = createActionType('FETCH_DATA_START')
const FETCH_DATA_END = createActionType('FETCH_DATA_END')

// Initial state
const initState = {
  txData: {},
  tokenData: {},
  methodData: {},
  tokenProps: {
    tokenDecimals: '',
    tokenSymbol: '',
  },
  ethTransactionAmount: '',
  ethTransactionFee: '',
  ethTransactionTotal: '',
  hexTransactionAmount: '',
  hexTransactionFee: '',
  hexTransactionTotal: '',
  fetchingData: false,
}

// Reducer
export default function reducer ({ confirmTransaction: confirmState = initState }, action = {}) {
  switch (action.type) {
    case UPDATE_TX_DATA:
      return {
        ...confirmState,
        txData: {
          ...action.payload,
        },
      }
    case CLEAR_TX_DATA:
      return {
        ...confirmState,
        txData: {},
      }
    case UPDATE_TOKEN_DATA:
      return {
        ...confirmState,
        tokenData: {
          ...action.payload,
        },
      }
    case CLEAR_TOKEN_DATA:
      return {
        ...confirmState,
        tokenData: {},
      }
    case UPDATE_METHOD_DATA:
      return {
        ...confirmState,
        methodData: {
          ...action.payload,
        },
      }
    case CLEAR_METHOD_DATA:
      return {
        ...confirmState,
        methodData: {},
      }
    case UPDATE_TRANSACTION_AMOUNTS:
      const { ethTransactionAmount } = action.payload
      return {
        ...confirmState,
        ethTransactionAmount: ethTransactionAmount || confirmState.ethTransactionAmount,
      }
    case UPDATE_TRANSACTION_FEES:
      const { ethTransactionFee } = action.payload
      return {
        ...confirmState,
        ethTransactionFee: ethTransactionFee || confirmState.ethTransactionFee,
      }
    case UPDATE_TRANSACTION_TOTALS:
      const { ethTransactionTotal } = action.payload
      return {
        ...confirmState,
        ethTransactionTotal: ethTransactionTotal || confirmState.ethTransactionTotal,
      }
    case UPDATE_TOKEN_PROPS:
      const { tokenSymbol = '', tokenDecimals = '' } = action.payload
      return {
        ...confirmState,
        tokenProps: {
          ...confirmState.tokenProps,
          tokenSymbol,
          tokenDecimals,
        },
      }
    case FETCH_DATA_START:
      return {
        ...confirmState,
        fetchingData: true,
      }
    case FETCH_DATA_END:
      return {
        ...confirmState,
        fetchingData: false,
      }
    case CLEAR_CONFIRM_TRANSACTION:
      return initState
    default:
      return confirmState
  }
}

// Action Creators
export function updateTxData (txData) {
  return {
    type: UPDATE_TX_DATA,
    payload: txData,
  }
}

export function clearTxData () {
  return {
    type: CLEAR_TX_DATA,
  }
}

export function updateTokenData (tokenData) {
  return {
    type: UPDATE_TOKEN_DATA,
    payload: tokenData,
  }
}

export function clearTokenData () {
  return {
    type: CLEAR_TOKEN_DATA,
  }
}

export function updateMethodData (methodData) {
  return {
    type: UPDATE_METHOD_DATA,
    payload: methodData,
  }
}

export function clearMethodData () {
  return {
    type: CLEAR_METHOD_DATA,
  }
}

export function updateTransactionAmounts (amounts) {
  return {
    type: UPDATE_TRANSACTION_AMOUNTS,
    payload: amounts,
  }
}

export function updateTransactionFees (fees) {
  return {
    type: UPDATE_TRANSACTION_FEES,
    payload: fees,
  }
}

export function updateTransactionTotals (totals) {
  return {
    type: UPDATE_TRANSACTION_TOTALS,
    payload: totals,
  }
}

export function updateTokenProps (tokenProps) {
  return {
    type: UPDATE_TOKEN_PROPS,
    payload: tokenProps,
  }
}


export function setFetchingData (isFetching) {
  return {
    type: isFetching ? FETCH_DATA_START : FETCH_DATA_END,
  }
}


export function updateTxDataAndCalculate (txData) {
  return (dispatch, getState) => {
    const state = getState()
    const conversionRate = conversionRateSelector(state)
    const nativeCurrency = getNativeCurrency(state)

    dispatch(updateTxData(txData))

    const { txParams: { value = '0x0'} = {} } = txData
    const ethTransactionAmount = getValueFromWeiHex({
      value, fromCurrency: nativeCurrency, toCurrency: nativeCurrency, conversionRate, numberOfDecimals: 6,
    })

    dispatch(updateTransactionAmounts({
      ethTransactionAmount,
    }))

    const ethTransactionTotal = addEth(ethTransactionAmount)

    dispatch(updateTransactionTotals({
      ethTransactionTotal,
    }))
  }
}

export function clearConfirmTransaction () {
  return {
    type: CLEAR_CONFIRM_TRANSACTION,
  }
}
