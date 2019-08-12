import React, { Component } from 'react'
import PropTypes from 'prop-types'
import OrderRowWrapper from '../order-row-wrapper'

export default class OrderDirectionRow extends Component {
  constructor (props) {
    super(props)
    this.state = {
      direction: 'buy',
    }
    const { updateDirection } = this.props
    updateDirection(this.state.direction)
  }

  static propTypes = {
    inError: PropTypes.bool,
    updateDirection: PropTypes.func,
    accountsAllTokenBal: PropTypes.object,
    counter: PropTypes.string,
  }

  static contextTypes = {
    t: PropTypes.func,
  }

 onDirectionChange = e => {
    const tk = e.target.value
    const { updateDirection } = this.props
    this.setState({
      direction: tk,
    })
    updateDirection(tk)
  }


  render () {
    const {inError, accountsAllTokenBal, counter} = this.props
    let ct = counter.split('/')[1].toUpperCase()
    if (ct == 'CNT') {
      ct = 'CNY'
    }
    if (ct == 'SWTC') {
      ct = 'SWT'
    }
    let base = counter.split('/')[0].toUpperCase()
    if (base == 'CNT') {
      base = 'CNY'
    }
    if (base == 'SWTC') {
      base = 'SWT'
    }
    let availableBal = 0
    const tokenBals = new Map(accountsAllTokenBal)
    if(this.state.direction == 'buy') {
      availableBal = tokenBals.get(ct)?tokenBals.get(ct):0
      availableBal = availableBal + " " + counter.split('/')[1].toUpperCase()
    }else {
      availableBal = tokenBals.get(base)?tokenBals.get(base):0
      availableBal = availableBal + " " + counter.split('/')[0].toUpperCase()
    }
    const {t} = this.context
    return (
      <div>
      <OrderRowWrapper
        label={`${t('direction')}:`}
        showError={inError}
      >
       <select style={{width: '100%', height: '32px'}}
                value={this.state.direction}
                onChange={this.onDirectionChange}
              >
                 <option key="buy" value="buy">
                    {'buy'}
                  </option>
                  <option key="sell" value="sell">
                    {'sell'}
                  </option>
              </select>
      </OrderRowWrapper>
         <div style={{margin: '14.5px 18px 0px'}}>可用：{availableBal}</div>
         </div>
    )
  }
}
