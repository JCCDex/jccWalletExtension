import React, { Component } from 'react'
import PropTypes from 'prop-types'
import OrderRowWrapper from '../order-row-wrapper/'
import UserPreferencedCurrencyInput from '../../../user-preferenced-currency-input'

export default class OrderPriceRow extends Component {

  static propTypes = {
    price: PropTypes.string,
    updateOrderPrice: PropTypes.func,
  }

  static contextTypes = {
    t: PropTypes.func,
  }

  validatePrice () {
    
  }

  updateOrderPrice (price) {
    const { updateOrderPrice } = this.props
    updateOrderPrice(price)
  }

  renderInput () {
    const { price } = this.props
    const Component = UserPreferencedCurrencyInput
    return (
      <Component
        style={{width: '100%', height: '32px'}}
        onChange={newPrice => this.validatePrice(newPrice)}
        onBlur={newPrice => {
          this.updateOrderPrice(newPrice)
        }}
        value={price}
      />
    )
  }

  render () {
    const {t} = this.context
    return (
      <div>
        <OrderRowWrapper
          label={`${this.context.t('price')}:`}
          errorType={'amount'}
        >
          { this.renderInput() }
        </OrderRowWrapper>
        <div style={{margin: '14.5px 18px 0px'}}>{t('price_reference')}：<a target='_blank' href='https://weidex.vip/#/trade'>{t('weidex')}</a></div>
      </div>
    )
  }

}
