import React from 'react'
import PropTypes from 'prop-types'
import PersistentForm from '../../../lib/persistent-form'

import SendHeader from './send-header/'
import SendContent from './send-content/'
import SendFooter from './send-footer/'

export default class SendTransactionScreen extends PersistentForm {

  static propTypes = {
    amount: PropTypes.string,
    amountConversionRate: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    from: PropTypes.object,
    history: PropTypes.object,
    primaryCurrency: PropTypes.string,
    recentBlocks: PropTypes.array,
    selectedAddress: PropTypes.string,
    selectedToken: PropTypes.object,
    tokenBalance: PropTypes.string,
    updateSendErrors: PropTypes.func,
    updateSendTokenBalance: PropTypes.func,
    scanQrCode: PropTypes.func,
    qrCodeDetected: PropTypes.func,
    qrCodeData: PropTypes.object,
  }

  static contextTypes = {
    t: PropTypes.func,
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.qrCodeData) {
      if (nextProps.qrCodeData.type === 'address') {
        const scannedAddress = nextProps.qrCodeData.values.address.toLowerCase()
        const currentAddress = this.props.to && this.props.to.toLowerCase()
        if (currentAddress !== scannedAddress) {
          this.props.updateSendTo(scannedAddress)
          // Clean up QR code data after handling
          this.props.qrCodeDetected(null)
        }
      }
    }
  }


  componentWillMount () {
    const {
      from: { address },
      selectedToken,
      tokenContract,
      updateSendTokenBalance,
    } = this.props

    updateSendTokenBalance({
      selectedToken,
      tokenContract,
      address,
    })

    // Show QR Scanner modal  if ?scan=true
    if (window.location.search === '?scan=true') {
      this.props.scanQrCode()

      // Clear the queryString param after showing the modal
      const cleanUrl = location.href.split('?')[0]
      history.pushState({}, null, `${cleanUrl}`)
      window.location.hash = '#send'
    }
  }

  componentWillUnmount () {
    this.props.resetSendState()
  }

  render () {
    const { history, showHexData } = this.props

    return (
      <div className="page-container">
        <SendHeader history={history}/>
        <SendContent
          scanQrCode={_ => this.props.scanQrCode()}
          showHexData={showHexData}
        />
        <SendFooter history={history}/>
      </div>
    )
  }

}
