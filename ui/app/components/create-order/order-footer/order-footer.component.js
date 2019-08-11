import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PageContainerFooter from '../../page-container/page-container-footer'
import { DEFAULT_ROUTE } from '../../../routes'

export default class OrderFooter extends Component {

  static propTypes = {
    orderAmount: PropTypes.string,
    orderDirection: PropTypes.string,
    orderSum: PropTypes.string,
    counter: PropTypes.string,
    createJccOrder: PropTypes.func,
    orderPassword: PropTypes.string,
    disabled: PropTypes.bool,
    errors: PropTypes.object,
    selectAddress: PropTypes.object,
    history: PropTypes.object,
    inError: PropTypes.bool,
    update: PropTypes.func,
    warning: PropTypes.object,
    jccWarning: PropTypes.string,
  }

  state = {
    sendErrorMsg: '',
  }

  static contextTypes = {
    t: PropTypes.func,
    metricsEvent: PropTypes.func,
  };

  onCancel () {
    this.props.clearSend()
    this.props.history.push(DEFAULT_ROUTE)
  }

  formShouldBeDisabled () {
    //const password = document.getElementById('password').value
    const { orderAmount, orderPrice } = this.props
    let shouldBeDisabled = true
    if(orderAmount > 0 && orderPrice > 0) {
      shouldBeDisabled = false
    }
    return shouldBeDisabled
  }

  onSubmit (event) {
    event.preventDefault()
    const {
      from,
      orderAmount,
      orderDirection,
      orderPrice,
      counter,
      createJccOrder,
      orderPassword,
    } = this.props
    const { metricsEvent } = this.context
    const password = document.getElementById('orderpassword').value
    const promise = createJccOrder({ from, orderAmount, orderDirection, orderPrice, counter, password })
    Promise.resolve(promise)
      .then((result) => {
        metricsEvent({
          eventOpts: {
            category: 'Transactions',
            action: 'Edit Screen',
            name: 'Complete',
          },
        })
      })
  }

  render () {
    return (
      <PageContainerFooter
        onCancel={() => this.onCancel()}
        onSubmit={e => this.onSubmit(e)}
        disabled={this.formShouldBeDisabled()}
      />
    )
  }

}
