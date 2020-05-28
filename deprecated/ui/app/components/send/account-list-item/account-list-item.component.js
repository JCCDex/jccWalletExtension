import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Identicon from '../../identicon'
import UserPreferencedCurrencyDisplay from '../../user-preferenced-currency-display'
import { PRIMARY } from '../../../constants/common'
import Tooltip from '../../tooltip-v2'

export default class AccountListItem extends Component {

  static propTypes = {
    account: PropTypes.object,
    className: PropTypes.string,
    conversionRate: PropTypes.number,
    currentCurrency: PropTypes.string,
    displayAddress: PropTypes.bool,
    displayBalance: PropTypes.bool,
    handleClick: PropTypes.func,
    icon: PropTypes.node,
    balanceIsCached: PropTypes.bool,
    showFiat: PropTypes.bool,
  };

  static defaultProps = {
    showFiat: true,
  }

  static contextTypes = {
    t: PropTypes.func,
  };

  render () {
    const {
      account,
      className,
      displayAddress = false,
      displayBalance = true,
      handleClick,
      icon = null,
      balanceIsCached,
    } = this.props

    const { name, address, balance } = account || {}

    return (<div
      className={`account-list-item ${className}`}
      onClick={() => handleClick && handleClick({ name, address, balance })}
    >

      <div className="account-list-item__top-row">
        <Identicon
          address={address}
          className="account-list-item__identicon"
          diameter={18}
        />

        <div className="account-list-item__account-name">{ name || address }</div>

        {icon && <div className="account-list-item__icon">{ icon }</div>}

      </div>

      {displayAddress && name && <div className="account-list-item__account-address">
        address
      </div>}

      {
        displayBalance && (
          <Tooltip
            position="left"
            title={this.context.t('balanceOutdated')}
            disabled={!balanceIsCached}
            style={{
              left: '-20px !important',
            }}
          >
            <div className={classnames('account-list-item__account-balances', {
              'account-list-item__cached-balances': balanceIsCached,
            })}>
              <div className="account-list-item__primary-cached-container">
                <UserPreferencedCurrencyDisplay
                  type={PRIMARY}
                  value={balance}
                  hideTitle={true}
                />
                {
                  balanceIsCached ? <span className="account-list-item__cached-star">*</span> : null
                }
              </div>
            </div>
          </Tooltip>
        )
      }

    </div>)
  }
}
