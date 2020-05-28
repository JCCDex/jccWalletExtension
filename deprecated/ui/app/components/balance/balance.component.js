import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import TokenBalance from '../token-balance'
import Identicon from '../identicon'
import UserPreferencedCurrencyDisplay from '../user-preferenced-currency-display'
import { PRIMARY } from '../../constants/common'

export default class Balance extends PureComponent {
  static propTypes = {
    account: PropTypes.object,
    assetImages: PropTypes.object,
    nativeCurrency: PropTypes.string,
    needsParse: PropTypes.bool,
    network: PropTypes.string,
    showFiat: PropTypes.bool,
    token: PropTypes.object,
  }

  static defaultProps = {
    needsParse: true,
    showFiat: true,
  }

  static contextTypes = {
    t: PropTypes.func,
  }

  renderBalance () {
    const {t} = this.context
    const { account } = this.props
    const balanceValue = account && account.balance
    const formattedBalance = balanceValue
   //   ? formatBalance(balanceValue, 6, needsParse, nativeCurrency)
   //   : '...'
    if (formattedBalance === 'None' || formattedBalance === '...') {
      return (
        <div className="flex-column balance-display">
          <div className="token-amount">
            { formattedBalance }
          </div>
        </div>
      )
    }
    if(balanceValue != undefined){
      if(balanceValue == 0) {
        return (
          <div className="flex-column balance-display">   
          <div>{t('account_not_activate')}</div>   
          <UserPreferencedCurrencyDisplay
            className="token-amount"
            value={balanceValue}
            type={PRIMARY}
            ethNumberOfDecimals={4}
          />       
        </div> 
      )
      }else {
        return (
          <div className="flex-column balance-display">
          <UserPreferencedCurrencyDisplay
            className="token-amount"
            value={balanceValue}
            type={PRIMARY}
            ethNumberOfDecimals={4}
          />       
        </div> 
      )
      }    
    }
  }

  renderTokenBalance () {
    const { token } = this.props

    return (
      <div className="flex-column balance-display">
        <div className="token-amount">
          <TokenBalance token={token} />
        </div>
      </div>
    )
  }

  render () {
    const { token, network, assetImages } = this.props
    const address = token && token.address
    const image = assetImages && address ? assetImages[token.address] : undefined
    return (
      <div className="balance-container">
        <Identicon
          diameter={50}
          address={address}
          network={network}
          image={image}
        />
        { token ? this.renderTokenBalance() : this.renderBalance() }
      </div>
    )
  }
}
