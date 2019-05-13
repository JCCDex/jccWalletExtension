import { createSelector } from 'reselect'
import { calcTokenAmount } from '../token-util'
import { roundExponential } from '../helpers/confirm-transaction/util'


export const currentCurrencySelector = state => state.metamask.currentCurrency
export const conversionRateSelector = state => state.metamask.conversionRate
export const getNativeCurrency = state => state.metamask.nativeCurrency

export const txDataSelector = state => state.confirmTransaction.txData
const tokenDataSelector = state => state.confirmTransaction.tokenData
const tokenPropsSelector = state => state.confirmTransaction.tokenProps

const contractExchangeRatesSelector = state => state.metamask.contractExchangeRates

const tokenDecimalsSelector = createSelector(
  tokenPropsSelector,
  tokenProps => tokenProps && tokenProps.tokenDecimals
)

const tokenDataParamsSelector = createSelector(
  tokenDataSelector,
  tokenData => tokenData && tokenData.params || []
)

const txParamsSelector = createSelector(
  txDataSelector,
  txData => txData && txData.txParams || {}
)

export const tokenAddressSelector = createSelector(
  txParamsSelector,
  txParams => txParams && txParams.to
)

const TOKEN_PARAM_SPENDER = '_spender'
const TOKEN_PARAM_TO = '_to'
const TOKEN_PARAM_VALUE = '_value'

export const tokenAmountAndToAddressSelector = createSelector(
  tokenDataParamsSelector,
  tokenDecimalsSelector,
  (params, tokenDecimals) => {
    let toAddress = ''
    let tokenAmount = 0

    if (params && params.length) {
      const toParam = params.find(param => param.name === TOKEN_PARAM_TO)
      const valueParam = params.find(param => param.name === TOKEN_PARAM_VALUE)
      toAddress = toParam ? toParam.value : params[0].value
      const value = valueParam ? Number(valueParam.value) : Number(params[1].value)

      if (tokenDecimals) {
        tokenAmount = calcTokenAmount(value, tokenDecimals).toNumber()
      }

      tokenAmount = roundExponential(tokenAmount)
    }

    return {
      toAddress,
      tokenAmount,
    }
  }
)

export const approveTokenAmountAndToAddressSelector = createSelector(
  tokenDataParamsSelector,
  tokenDecimalsSelector,
  (params, tokenDecimals) => {
    let toAddress = ''
    let tokenAmount = 0

    if (params && params.length) {
      toAddress = params.find(param => param.name === TOKEN_PARAM_SPENDER).value
      const value = Number(params.find(param => param.name === TOKEN_PARAM_VALUE).value)

      if (tokenDecimals) {
        tokenAmount = calcTokenAmount(value, tokenDecimals).toNumber()
      }

      tokenAmount = roundExponential(tokenAmount)
    }

    return {
      toAddress,
      tokenAmount,
    }
  }
)

export const sendTokenTokenAmountAndToAddressSelector = createSelector(
  tokenDataParamsSelector,
  tokenDecimalsSelector,
  (params, tokenDecimals) => {
    let toAddress = ''
    let tokenAmount = 0

    if (params && params.length) {
      toAddress = params.find(param => param.name === TOKEN_PARAM_TO).value
      let value = Number(params.find(param => param.name === TOKEN_PARAM_VALUE).value)

      if (tokenDecimals) {
        value = calcTokenAmount(value, tokenDecimals).toNumber()
      }

      tokenAmount = roundExponential(value)
    }

    return {
      toAddress,
      tokenAmount,
    }
  }
)

export const contractExchangeRateSelector = createSelector(
  contractExchangeRatesSelector,
  tokenAddressSelector,
  (contractExchangeRates, tokenAddress) => contractExchangeRates[tokenAddress]
)
