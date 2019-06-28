import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PageContainerFooter from '../../page-container/page-container-footer'
import { DEFAULT_ROUTE } from '../../../routes'

export default class SendFooter extends Component {

  static propTypes = {
    addToAddressBookIfNew: PropTypes.func,
    amount: PropTypes.string,
    sendCur: PropTypes.string,
    sendMemo: PropTypes.string,
    data: PropTypes.string,
    clearSend: PropTypes.func,
    disabled: PropTypes.bool,
    editingTransactionId: PropTypes.string,
    errors: PropTypes.object,
    from: PropTypes.object,
    history: PropTypes.object,
    inError: PropTypes.bool,
    selectedToken: PropTypes.object,
    sign: PropTypes.func,
    to: PropTypes.string,
    toAccounts: PropTypes.array,
    tokenBalance: PropTypes.string,
    unapprovedTxs: PropTypes.object,
    update: PropTypes.func,
    sendErrors: PropTypes.object,
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

  onSubmit (event) {
    event.preventDefault()
    const {
      amount,
      data,
      from: {address: from},
      selectedToken,
      sign,
      to,
      sendCur,
      sendMemo,
      history,
      warning,
    } = this.props
    const { metricsEvent } = this.context
    const password = document.getElementById('password').value
    // Should not be needed because submit should be disabled if there are errors.
    // const noErrors = !amountError && toError === null

    // if (!noErrors) {
    //   return
    // }

    // TODO: add nickname functionality
   // addToAddressBookIfNew(to, toAccounts)
    const promise = sign({ data, selectedToken, to, amount, from, password, sendCur, sendMemo })
    Promise.resolve(promise)
      .then((result) => {
        metricsEvent({
          eventOpts: {
            category: 'Transactions',
            action: 'Edit Screen',
            name: 'Complete',
          },
        })
        //history.push(CONFIRM_TRANSACTION_ROUTE)
      })
  }

  formShouldBeDisabled () {
    const { data, inError, selectedToken, tokenBalance, to } = this.props
    const missingTokenBalance = selectedToken && !tokenBalance
    const shouldBeDisabled = inError || missingTokenBalance || !(data || to)
    return shouldBeDisabled
  }

  componentDidUpdate (prevProps) {
    const { inError, sendErrors, jccWarning } = this.props
   // console.log('jccWarning:' + jccWarning)
    const { metricsEvent } = this.context
    if (!prevProps.inError && inError) {
      const errorField = Object.keys(sendErrors).find(key => sendErrors[key])
      const errorMessage = sendErrors[errorField]

      metricsEvent({
        eventOpts: {
          category: 'Transactions',
          action: 'Edit Screen',
          name: 'Error',
        },
        customVariables: {
          errorField,
          errorMessage,
        },
      })
    }
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
