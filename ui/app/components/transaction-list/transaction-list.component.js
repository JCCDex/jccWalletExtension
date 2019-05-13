import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import TransactionListItem from '../transaction-list-item'
const Jccutils = require('../../components/send/jccutils')

export default class TransactionList extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
  }

  componentWillMount () {
    const jccutils = new Jccutils()
    const { selectedAddress } = this.props
    jccutils.getHistoricPayments(selectedAddress).then((res) => {
      if (res.result) {
       this.setState({ completedTransactions: res.data.transactions })
      }
    })
  }
 
  componentWillReceiveProps (nextProps) {
    const jccutils = new Jccutils()
    if (this.props.selectedAddress !== nextProps.selectedAddress) {
      jccutils.getHistoricPayments(nextProps.selectedAddress).then((res) => {
        if (res.result) {
         this.setState({ completedTransactions: res.data.transactions })
        }
      })
    }
  }

  static propTypes = {
    selectedToken: PropTypes.object,
    selectedAddress: PropTypes.string,
    assetImages: PropTypes.object,
  }

  state = {
    completedTransactions: [],
  }

  renderTransactions () { 
   // return async () => {
   // const jccutils = new Jccutils()
    const { t } = this.context
    const { selectedAddress } = this.props
      //jccutils.getHistoricPayments(selectedAddress).then((res) => {
     //   if (res.result) {
     //     this.setState((prevState) => {
     //       if (prevState.selectedAddress !== selectedAddress) {
     //         return {completedTransactions: res.data.transactions}
     //       }      
    //      })
        // this.setState({ completedTransactions: res.data.transactions })
   //     }
   //   })
   
    return (
      <div className="transaction-list__transactions">
        <div className="transaction-list__completed-transactions">
          <div className="transaction-list__header">
            { t('history') }
          </div>
          {
            this.state.completedTransactions.length > 0
              ? this.state.completedTransactions.map((transactionGroup, index) => (
                  this.renderTransaction(transactionGroup, index)
                ))
              : this.renderEmpty()
          }
        </div>
      </div>
    )
 // }
}

  renderTransaction (transactionGroup, index) {
   // const { selectedToken, assetImages } = this.props
   // const { transactions = [] } = transactionGroup
    return (
      <TransactionListItem
        transaction={transactionGroup}
        key={`${index}`}
      />
    )
  }

  renderEmpty () {
    return (
      <div className="transaction-list__empty">
        <div className="transaction-list__empty-text">
          { this.context.t('noTransactions') }
        </div>
      </div>
    )
  }

  render () {
    return (
      <div className="transaction-list">
        { this.renderTransactions() }
      </div>
    )
  }
}
