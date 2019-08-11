import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import copyToClipboard from 'copy-to-clipboard'
import SenderToRecipient from '../sender-to-recipient'
import Button from '../button'
import Tooltip from '../tooltip'


export default class TransactionListItemDetails extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
    metricsEvent: PropTypes.func,
  }

  static propTypes = {
    transactionGroup: PropTypes.object,
  }

  state = {
    justCopied: false,
  }

  handleEtherscanClick = () => {
    const { transactionGroup } = this.props
    const { hash } = transactionGroup

    const swtcscanUrl = `https://swtcscan.jccdex.cn/#/trade/tradeDetail/?hash=${hash}`

    this.context.metricsEvent({
      eventOpts: {
        category: 'Navigation',
        action: 'Activity Log',
        name: 'Clicked "View on swtcscan"',
      },
    })

    global.platform.openWindow({ url: swtcscanUrl })
  }


  handleCopyTxId = () => {
    const { transactionGroup } = this.props
    const { hash } = transactionGroup
    this.context.metricsEvent({
      eventOpts: {
        category: 'Navigation',
        action: 'Activity Log',
        name: 'Copied Transaction ID',
      },
    })

    this.setState({ justCopied: true }, () => {
      copyToClipboard(hash)
      setTimeout(() => this.setState({ justCopied: false }), 1000)
    })
  }

  render () {
    const { t } = this.context
    const { justCopied } = this.state
    const { transactionGroup } = this.props
    const { sender, receiver, amount, currency, time } = transactionGroup
    let timeToDate = new Date(time*1000).toLocaleString()
    timeToDate = timeToDate.split("/").join('-');
    return (
      <div className="transaction-list-item-details">
        <div className="transaction-list-item-details__header">
          <div>{ t('details') }</div>
          <div className="transaction-list-item-details__header-buttons">
            <Tooltip title={justCopied ? t('copiedTransactionId') : t('copyTransactionId')}>
              <Button
                type="raised"
                onClick={this.handleCopyTxId}
                className="transaction-list-item-details__header-button"
              >
                <img
                  className="transaction-list-item-details__header-button__copy-icon"
                  src="/images/copy-to-clipboard.svg"
                />
              </Button>
            </Tooltip>
            <Tooltip title={t('viewOnSwtcscan')}>
              <Button
                type="raised"
                onClick={this.handleEtherscanClick}
                className="transaction-list-item-details__header-button"
                >
                <img src="/images/arrow-popout.svg" />
              </Button>
            </Tooltip>
          </div>
        </div>
        <div className="transaction-list-item-details__body">
          <div className="transaction-list-item-details__sender-to-recipient-container">
            <SenderToRecipient
              addressOnly
              recipientAddress={receiver}
              senderAddress={sender}
              value={amount}
              currency={currency}
              onRecipientClick={() => {
                this.context.metricsEvent({
                  eventOpts: {
                    category: 'Navigation',
                    action: 'Activity Log',
                    name: 'Copied "To" Address',
                  },
                })
              }}
            />
            <br/>
            <span>
            数量：{amount}
          </span>
          <span>
          &nbsp;&nbsp;币种：{currency}
          </span>
          <span>
            &nbsp;&nbsp;交易时间：{timeToDate}
          </span>
          </div>
        </div>
      </div>
    )
  }
}
