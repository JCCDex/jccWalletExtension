import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { PRIMARY, SECONDARY, SWTC } from '../../constants/common'
import CurrencyDisplay from '../currency-display'

export default class UserPreferencedCurrencyDisplay extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    prefix: PropTypes.string,
    value: PropTypes.string,
    numberOfDecimals: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    hideLabel: PropTypes.bool,
    hideTitle: PropTypes.bool,
    address: PropTypes.string,
    style: PropTypes.object,
    showEthLogo: PropTypes.bool,
    ethLogoHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    // Used in container
    type: PropTypes.oneOf([PRIMARY, SECONDARY]),
    ethNumberOfDecimals: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    fiatNumberOfDecimals: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    ethPrefix: PropTypes.string,
    // From container
    currency: PropTypes.string,
    nativeCurrency: PropTypes.string,
  }

  renderEthLogo () {
    const { currency, showEthLogo, ethLogoHeight = 12 } = this.props

    return currency === SWTC && showEthLogo && (
      <img
        src="/images/eth.svg"
        height={ethLogoHeight}
      />
    )
  }

  render () {
    return (
      <CurrencyDisplay
        {...this.props}
        prefixComponent={this.renderEthLogo()}
      />
    )
  }
}
