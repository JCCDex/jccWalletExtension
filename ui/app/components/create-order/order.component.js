import React from 'react'
import PropTypes from 'prop-types'
import PersistentForm from '../../../lib/persistent-form'

import OrderHeader from './order-header/'
import OrderContent from './order-content/'
import OrderFooter from './order-footer/'

export default class Order extends PersistentForm {

  static propTypes = {
    history: PropTypes.object,
    selectedAddress: PropTypes.string,
  }

  static contextTypes = {
    t: PropTypes.func,
  }

  render () {
    const { history } = this.props

    return (
      <div className="page-container">
        <OrderHeader history={history}/>
        <OrderContent/>
        <OrderFooter history={history}/>
      </div>
    )
  }

}
