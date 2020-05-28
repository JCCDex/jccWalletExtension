import React, { Component } from 'react'
import PropTypes from 'prop-types'
import OrderRowWrapper from '../order-row-wrapper/'
import AccountListItem from '../../account-list-item'

export default class SendFromRow extends Component {
  static propTypes = {
    from: PropTypes.object,
  }

  static contextTypes = {
    t: PropTypes.func,
  }

  render () {
    const { t } = this.context
    const { from } = this.props
    return (
      <OrderRowWrapper label={`${t('from')}:`}>
        <div className="send-v2__from-dropdown">
          <AccountListItem account={from} />
        </div>
      </OrderRowWrapper>
    )
  }
}
