import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Identicon from '../identicon'
import { DEFAULT_ROUTE } from '../../routes'
const ExtensionPlatform = require('../../../../app/scripts/platforms/extension')

export default class AppHeader extends PureComponent {
  static propTypes = {
    history: PropTypes.object,
    network: PropTypes.string,
    provider: PropTypes.object,
    toggleAccountMenu: PropTypes.func,
    selectedAddress: PropTypes.string,
    isUnlocked: PropTypes.bool,
    hideNetworkIndicator: PropTypes.bool,
    disabled: PropTypes.bool,
    isAccountMenuOpen: PropTypes.bool,
  }

  static contextTypes = {
    t: PropTypes.func,
    metricsEvent: PropTypes.func,
  }

  renderAccountMenu () {
    const { isUnlocked, toggleAccountMenu, selectedAddress, disabled, isAccountMenuOpen } = this.props
    return (
      <div
        className={classnames('account-menu__icon', {
          'account-menu__icon--disabled': disabled,
        })}
        onClick={() => {
          if (!disabled) {
            !isAccountMenuOpen && this.context.metricsEvent({
              eventOpts: {
                category: 'Navigation',
                action: 'Home',
                name: 'Opened Main Menu',
              },
            })
            toggleAccountMenu()
          }
        }}
      >
        <Identicon
          address={selectedAddress}
          diameter={32}
        />
      </div>
    )
  }

  render () {
    const {
      history,
      provider,
      isUnlocked,
      disabled,
    } = this.props
    const platform = new ExtensionPlatform()
    return (
      <div
        className={classnames('app-header', { 'app-header--back-drop': isUnlocked })}>
        <div className="app-header__contents">
          <div
            className="app-header__logo-container"
            onClick={() => history.push(DEFAULT_ROUTE)}
          >
            <img
              className="app-header__metafox-logo app-header__metafox-logo--horizontal"
              src="/images/logo/swtclogo.png"
             // width={163}
              height={30}
            />
            <img
              className="app-header__metafox-logo app-header__metafox-logo--icon"
              src="/images/logo/swtc.png"
              height={42}
              width={42}
              onClick={() => platform.openExtensionInBrowser()}
            />
          </div>
          <div className="app-header__account-menu-container">
            { this.renderAccountMenu() }
          </div>
        </div>
      </div>
    )
  }
}
