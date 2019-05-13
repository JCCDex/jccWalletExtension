import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PageContainerContent from '../../page-container/page-container-content.component'
import SendAmountRow from './send-amount-row/'
import SendFromRow from './send-from-row/'
import SendHexDataRow from './send-hex-data-row'
import SendPasswordRow from './send-password-row'
import SendCurrencyRow from './send-currency-row'
import SendToRow from './send-to-row/'


export default class SendContent extends Component {


  static propTypes = {
    scanQrCode: PropTypes.func,
    showHexData: PropTypes.bool,
  }

  render () {
    return (
      <PageContainerContent>
        <div className="send-v2__form">
          <SendFromRow />
          <SendToRow
            scanQrCode={ _ => this.props.scanQrCode()}
          />
          <SendAmountRow />
          <SendPasswordRow />
          <SendCurrencyRow />
          {(this.props.showHexData && (
            <SendHexDataRow />
          ))}
        </div>
      </PageContainerContent>
    )
  }

}
