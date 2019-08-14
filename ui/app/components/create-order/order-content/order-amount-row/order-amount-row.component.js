import React, { Component } from 'react'
import PropTypes from 'prop-types'
import UserPreferencedCurrencyInput from '../../../user-preferenced-currency-input'
import OrderRowWrapper from '../order-row-wrapper'

export default class OrderAmountRow extends Component {

  static propTypes = {
    amount: PropTypes.string,
    updateOrderAmount: PropTypes.func,
  }

  static contextTypes = {
    t: PropTypes.func,
  }

  validateAmount () {

  }

  updateAmount (amount) {
    const { updateOrderAmount } = this.props
    updateOrderAmount(amount)
  }

  renderInput () {
    const { amount } = this.props
    const Component = UserPreferencedCurrencyInput

    return (
      <Component
        onChange={newAmount => this.validateAmount(newAmount)}
        onBlur={newAmount => {
          this.updateAmount(newAmount)
        }}
        value={amount}
      />
    )
  }

  render () {
    const { inError } = this.props

    return (
      <OrderRowWrapper
        label={`${this.context.t('amount')}:`}
        showError={inError}
        errorType={'amount'}
      >
        { this.renderInput() }
      </OrderRowWrapper>
    )
  }

}
