import React, { Component } from 'react'
import PageContainerContent from '../../page-container/page-container-content.component'
import OrderAmountRow from './order-amount-row/'
import OrderPasswordRow from './order-password-row'
import OrderDirectionRow from './order-direction-row'
import OrderCounterRow from './order-counter-row'
import OrderPriceRow from './order-price-row'
import OrderFromRow from './order-from-row'


export default class OrderContent extends Component {


  render () {
    return (
      <PageContainerContent>
        <div className="send-v2__form">
          <OrderFromRow />
          <OrderCounterRow />
          <OrderDirectionRow />
          <OrderAmountRow />    
          <OrderPriceRow/>      
          <OrderPasswordRow />
        </div>
      </PageContainerContent>
    )
  }

}
