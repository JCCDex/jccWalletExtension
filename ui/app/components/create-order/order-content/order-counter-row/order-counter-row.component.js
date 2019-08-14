import React, { Component } from 'react'
import PropTypes from 'prop-types'
import OrderRowWrapper from '../order-row-wrapper'
import {JCC_COUNTER} from '../../order.constants'

export default class OrderCounterRow extends Component {

  constructor (props) {
    super(props)
    this.state = {
      counter: 'swtc/cnt',
    }
    const { updateCounter } = this.props
    updateCounter(this.state.counter)
  }

  static propTypes = {
    inError: PropTypes.bool,
    updateCounter: PropTypes.func,
  }

  static contextTypes = {
    t: PropTypes.func,
  }

 onCounterChange = e => {
    const cr = e.target.value
    const { updateCounter } = this.props
    this.setState({
      counter: cr,
    })
    updateCounter(cr)
  }


  render () {
    const {inError} = this.props
    const {t} = this.context
    return (
      <OrderRowWrapper
        label={`${t('pair')}:`}
        showError={inError}
        errorType={'currency'}
      >
       <select style={{width: '100%', height: '32px'}}
                value={this.state.counter}
                onChange={this.onCounterChange}
              >
                {JCC_COUNTER.map((counter) => (
                  <option key={counter} value={counter}>
                    {counter}  
                  </option>
                ))}
              </select>
      </OrderRowWrapper>
    )
  }
}
