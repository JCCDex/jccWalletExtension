import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash.debounce'
import { Menu, Item, Divider } from '../dropdowns/components/menu'
import Tooltip from '../tooltip'
import UserPreferencedCurrencyDisplay from '../user-preferenced-currency-display'
import { PRIMARY } from '../../constants/common'
import JingchangWallet from 'jcc_wallet/lib/jingchangWallet'
import { JcExchange, JcConfig } from 'jcc_rpc'
import {
  NEW_ACCOUNT_ROUTE,
  IMPORT_ACCOUNT_ROUTE,
  DEFAULT_ROUTE,
} from '../../routes'

export default class AccountMenu extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
    metricsEvent: PropTypes.func,
  }

  static propTypes = {
    accounts: PropTypes.object,
    history: PropTypes.object,
    identities: PropTypes.object,
    isAccountMenuOpen: PropTypes.bool,
    prevIsAccountMenuOpen: PropTypes.bool,
    keyrings: PropTypes.array,
    lockMetamask: PropTypes.func,
    selectedAddress: PropTypes.string,
    showAccountDetail: PropTypes.func,
    showRemoveAccountConfirmationModal: PropTypes.func,
    toggleAccountMenu: PropTypes.func,
  }

  state = {
    balanceValue: 0,
    atAccountListBottom: false,
  }

  componentDidUpdate (prevProps) {
    const { prevIsAccountMenuOpen } = prevProps
    const { isAccountMenuOpen } = this.props

    if (!prevIsAccountMenuOpen && isAccountMenuOpen) {
      this.setAtAccountListBottom()
    }
  }

   renderAccounts () {
    const {
      identities,
      accounts,
      selectedAddress,
      showAccountDetail,
    } = this.props
    const wallets = JingchangWallet.getWallets(JingchangWallet.get())
    // this.getJccRpc()
    return wallets.map(wallet => {
      const isSelected = wallet.address === selectedAddress
     // let bal = 0
      const balanceValue = accounts[wallet.address] ? accounts[wallet.address].balance : ''
      return (
        <div
          className="account-menu__account menu__item--clickable"
          onClick={() => {
            this.context.metricsEvent({
              eventOpts: {
                category: 'Navigation',
                action: 'Main Menu',
                name: 'Switched Account',
              },
            })
            showAccountDetail(wallet.address)
          }}
          key={wallet.address}
        >
          <div className="account-menu__check-mark">
            { isSelected && <div className="account-menu__check-mark-icon" /> }
          </div>
          <div className="account-menu__account-info">
            <div className="account-menu__name">
              { identities[wallet.address] ? identities[wallet.address].name : 'Account 0' }
            </div>
            <UserPreferencedCurrencyDisplay
              className="account-menu__balance"
              value={ balanceValue }
              type={PRIMARY}
            />
          </div>
        </div>
      )
    })
  }

  renderRemoveAccount (identity) {
    const { t } = this.context
    // Any account that's not from the HD wallet Keyring can be removed

    return (
      <Tooltip
        title={t('removeAccount')}
        position="bottom"
      >
        <a
          className="remove-account-icon"
          onClick={e => this.removeAccount(e, identity)}
        />
      </Tooltip>
    )
  }
  

  async getJccRpc () {
    const hosts = ['jccdex.cn', 'weidex.vip']
    const port = 443
    const https = true
    const instance = await new JcConfig(hosts, port, https)
    this.defaultMaxListeners = 20
    const res = await instance.getConfig()
  // import { JcExchange } from 'jcc_rpc'
  const exhosts = res.exHosts
   const excport = 443
   const exhttps = true
    const jccInstance = await new JcExchange(exhosts, excport, exhttps)
    return jccInstance
  }

  removeAccount (e, identity) {
    e.preventDefault()
    e.stopPropagation()
    const { showRemoveAccountConfirmationModal } = this.props
    showRemoveAccountConfirmationModal(identity)
  }


  setAtAccountListBottom = () => {
    const target = document.querySelector('.account-menu__accounts')
    const { scrollTop, offsetHeight, scrollHeight } = target
    const atAccountListBottom = scrollTop + offsetHeight >= scrollHeight
    this.setState({ atAccountListBottom })
  }

  onScroll = debounce(this.setAtAccountListBottom, 25)

  handleScrollDown = e => {
    e.stopPropagation()
    const target = document.querySelector('.account-menu__accounts')
    const { scrollHeight } = target
    target.scroll({ left: 0, top: scrollHeight, behavior: 'smooth' })
    this.setAtAccountListBottom()
  }

  renderScrollButton () {
    const { accounts } = this.props
    const { atAccountListBottom } = this.state

    return !atAccountListBottom && Object.keys(accounts).length > 3 && (
      <div
        className="account-menu__scroll-button"
        onClick={this.handleScrollDown}
      >
        <img
          src="./images/icons/down-arrow.svg"
          width={28}
          height={28}
        />
      </div>
    )
  }

  render () {
    const { t } = this.context
    const {
      isAccountMenuOpen,
      toggleAccountMenu,
     // lockMetamask,
      history,
    } = this.props
    const { metricsEvent } = this.context

    return (
      <Menu
        className="account-menu"
        isShowing={isAccountMenuOpen}
      >
        
        <Divider />
        <div className="account-menu__accounts-container">
          <div
            className="account-menu__accounts"
            onScroll={this.onScroll}
          >
            { this.renderAccounts() }
          </div>
          { this.renderScrollButton() }
        </div>
        <Divider />
        <Item
          onClick={() => {
            toggleAccountMenu()
            metricsEvent({
              eventOpts: {
                category: 'Navigation',
                action: 'Main Menu',
                name: 'Clicked Create Account',
              },
            })
            history.push(NEW_ACCOUNT_ROUTE)
          }}
          icon={
            <img
              className="account-menu__item-icon"
              src="images/plus-btn-white.svg"
            />
          }
          text={t('createAccount')}
        />
        <Item
          onClick={() => {
            toggleAccountMenu()
            metricsEvent({
              eventOpts: {
                category: 'Navigation',
                action: 'Main Menu',
                name: 'Clicked Import Account',
              },
            })
            history.push(IMPORT_ACCOUNT_ROUTE)
          }}
          icon={
            <img
              className="account-menu__item-icon"
              src="images/import-account.svg"
            />
          }
          text={t('importAccount')}
        />
      </Menu>
    )
  }
}
