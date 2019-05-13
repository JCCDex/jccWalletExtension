import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import TransactionListItemDetails from '../transaction-list-item-details'

export default class TransactionListItem extends PureComponent {
  static propTypes = {
    history: PropTypes.object,
    methodData: PropTypes.object,
    nonceAndDate: PropTypes.string,
    primaryTransaction: PropTypes.object,
    setSelectedToken: PropTypes.func,
    token: PropTypes.object,
    transaction: PropTypes.object,
    value: PropTypes.string,
  }


  static contextTypes = {
    metricsEvent: PropTypes.func,
  }

  state = {
    showTransactionDetails: true,
  }


  render () {
    const {
      transaction,
    } = this.props
    const { showTransactionDetails } = this.state

    return (
      <div className="transaction-list-item">
 
        <div className={classnames('transaction-list-item__expander', {
          'transaction-list-item__expander--show': showTransactionDetails,
        })}>
          {
            showTransactionDetails && (
              <div className="transaction-list-item__details-container">
                <TransactionListItemDetails
                  transactionGroup={transaction}
                />
              </div>
            )
          }
        </div>
      </div>
    )
  }
}
