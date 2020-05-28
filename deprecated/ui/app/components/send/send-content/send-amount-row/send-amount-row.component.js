import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SendRowWrapper from '../send-row-wrapper/'
import AmountMaxButton from './amount-max-button/'
import UserPreferencedCurrencyInput from '../../../user-preferenced-currency-input'
import UserPreferencedTokenInput from '../../../user-preferenced-token-input'

export default class SendAmountRow extends Component {

  static propTypes = {
    amount: PropTypes.string,
    amountConversionRate: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    balance: PropTypes.string,
    conversionRate: PropTypes.number,
    convertedCurrency: PropTypes.string,
    gasTotal: PropTypes.string,
    inError: PropTypes.bool,
    primaryCurrency: PropTypes.string,
    selectedToken: PropTypes.object,
    setMaxModeTo: PropTypes.func,
    tokenBalance: PropTypes.string,
    updateSendAmount: PropTypes.func,
    updateSendAmountError: PropTypes.func,
  }

  static contextTypes = {
    t: PropTypes.func,
  }

  validateAmount (amount) {
    const {
      amountConversionRate,
      balance,
      conversionRate,
      gasTotal,
      primaryCurrency,
      selectedToken,
      tokenBalance,
      updateSendAmountError,
    } = this.props

    updateSendAmountError({
      amount,
      amountConversionRate,
      balance,
      conversionRate,
      gasTotal,
      primaryCurrency,
      selectedToken,
      tokenBalance,
    })

  }

  updateAmount (amount) {
    const { updateSendAmount, setMaxModeTo } = this.props

    setMaxModeTo(false)
    updateSendAmount(amount)
  }

  renderInput () {
    const { amount, inError, selectedToken } = this.props
    const Component = selectedToken ? UserPreferencedTokenInput : UserPreferencedCurrencyInput

    return (
      <Component
        onChange={newAmount => this.validateAmount(newAmount)}
        onBlur={newAmount => {
          this.updateAmount(newAmount)
        }}
        error={inError}
        value={amount}
      />
    )
  }

  render () {
    const { inError } = this.props

    return (
      <SendRowWrapper
        label={`${this.context.t('amount')}:`}
        showError={inError}
        errorType={'amount'}
      >
        { this.renderInput() }
      </SendRowWrapper>
    )
  }

}
