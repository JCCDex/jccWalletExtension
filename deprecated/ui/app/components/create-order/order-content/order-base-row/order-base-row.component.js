import React, { Component } from 'react'
import PropTypes from 'prop-types'
import OrderRowWrapper from '../order-row-wrapper'
import {JCC_BASE} from '../../order.constants'

export default class OrderBaseRow extends Component {

  constructor (props) {
    super(props)
    this.state = {
      base: 'swt',
    }
    const { updateBase } = this.props
    updateBase(this.state.base)
  }

  static propTypes = {
    inError: PropTypes.bool,
    updateBase: PropTypes.func,
  }

  static contextTypes = {
    t: PropTypes.func,
  }

 onBaseChange = e => {
    const cr = e.target.value
    const { updateBase } = this.props
    this.setState({
      base: cr,
    })
    updateBase(cr)
  }


  render () {
    const {inError} = this.props
    const {t} = this.context
    return (
      <OrderRowWrapper
        label={`${t('base')}:`}
        showError={inError}
        errorType={'currency'}
      >
       <select style={{width: '250px', height: '32px'}}
                value={this.state.base}
                onChange={this.onBaseChange}
              >
                {JCC_BASE.map((base) => (
                  <option key={base} value={base}>
                    {base}  
                  </option>
                ))}
                 <option key="swt" value="swt">
                    {'swt'}
                  </option>
              </select>
      </OrderRowWrapper>
    )
  }
}
