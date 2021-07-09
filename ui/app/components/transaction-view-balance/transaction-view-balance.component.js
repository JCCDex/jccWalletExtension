import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Button from '../button'
import Identicon from '../identicon'
import TokenBalance from '../token-balance'
import UserPreferencedCurrencyDisplay from '../user-preferenced-currency-display'
import { SEND_ROUTE } from '../../routes'
import { CREATE_ORDER_ROUTE } from '../../routes'
import { PRIMARY } from '../../constants/common'
import Tooltip from '../tooltip-v2'

export default class TransactionViewBalance extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
    metricsEvent: PropTypes.func,
  }

  static propTypes = {
    showDepositModal: PropTypes.func,
    selectedToken: PropTypes.object,
    history: PropTypes.object,
    balance: PropTypes.string,
    assetImage: PropTypes.string,
    balanceIsCached: PropTypes.bool,
  }

  renderBalance () {
    const { selectedToken, balance, balanceIsCached } = this.props
    return selectedToken
      ? (
        <div className="transaction-view-balance__balance">
          <TokenBalance
            token={selectedToken}
            withSymbol
            className="transaction-view-balance__primary-balance"
          />
        </div>
      ) : (
          <Tooltip position="top" title={this.context.t('balanceOutdated')} disabled={!balanceIsCached}>
            <div className="transaction-view-balance__balance">
                <div className="transaction-view-balance__primary-container">
                  <UserPreferencedCurrencyDisplay
                    className={classnames('transaction-view-balance__primary-balance', {
                      'transaction-view-balance__cached-balance': balanceIsCached,
                    })}
                    value={balance}
                    type={PRIMARY}
                    ethNumberOfDecimals={4}
                    hideTitle={true}
                  />
                  {
                    balanceIsCached ? <span className="transaction-view-balance__cached-star">*</span> : null
                  }
                </div>
            </div>
          </Tooltip>
      )
  }

  renderButtons () {
    const { t, metricsEvent } = this.context
    const { selectedToken, showDepositModal, history } = this.props

    return (
      <div className="transaction-view-balance__buttons">

        <Button
          type="primary"
          className="transaction-view-balance__button--send"
          onClick={() => {
            metricsEvent({
              eventOpts: {
                category: 'Navigation',
                action: 'Home',
                name: 'Clicked Send',
              },
            })
            history.push(SEND_ROUTE)
          }}
        >
          { t('send') }
        </Button>
        {
          !selectedToken && (
            <Button
              type="primary"
              className="transaction-view-balance__button--reciver"
              onClick={() => {
                metricsEvent({
                  eventOpts: {
                    category: 'Navigation',
                    action: 'Home',
                    name: 'Clicked Deposit',
                  },
                })
                showDepositModal()
              }}
            >
              { t('deposit') }
            </Button>
          )
        }
      </div>
    )
  }

  render () {
    const { selectedToken, assetImage } = this.props

    return (
      <div className="transaction-view-balance">
        <div className="transaction-view-balance__balance-container">
          <Identicon
            diameter={50}
            address={selectedToken && selectedToken.address}
         //   network={network}
            image={assetImage}
          />
          { this.renderBalance() }
        </div>
        { this.renderButtons() }
      </div>
    )
  }
}
