import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SendRowWrapper from '../send-row-wrapper'

export default class SendCurrencyRow extends Component {

  constructor (props) {
    super(props)
    this.state = {
      password: '',
      sendCur: 'SWT',
    }
    const { updateSendCurrency } = this.props
    updateSendCurrency(this.state.sendCur)
  }

  static propTypes = {
    accountsTokenBal: PropTypes.object,
    inError: PropTypes.bool,
    updateSendCurrency: PropTypes.func,
    updateSendHexData: PropTypes.func.isRequired,
  }

  static contextTypes = {
    t: PropTypes.func,
  }

 // state = {
  //  password: '',
  //  sendCur: 'SWT',
 // }

  onCoinChange = e => {
    const cur = e.target.value
    const { updateSendCurrency } = this.props
    this.setState({
      sendCur: cur,
    })
    updateSendCurrency(cur)
  }


  render () {
    const {inError, accountsTokenBal} = this.props
    const {t} = this.context
   // accountsTokenBal.push({cur: 'SWT', val: 0})
    return (
      <SendRowWrapper
        label={`${t('tokenSymbol')}:`}
        showError={inError}
        errorType={'currency'}
      >
       <select style={{width: '250px', height: '32px'}}
                value={this.state.sendCur}
                onChange={this.onCoinChange}
              >
                {accountsTokenBal.map((tokenBal) => (
                  <option key={tokenBal.cur} value={tokenBal.cur}>
                    {tokenBal.cur}
                  </option>
                ))}
                 <option key="SWT" value="SWT">
                    {'SWT'}
                  </option>
              </select>
      </SendRowWrapper>
    )
  }
}
