import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PageContainerHeader from '../../page-container/page-container-header'
import { DEFAULT_ROUTE } from '../../../routes'

export default class OrderHeader extends Component {

  static propTypes = {
    history: PropTypes.object,
  };

  static contextTypes = {
    t: PropTypes.func,
  };

  onClose () {
    this.props.history.push(DEFAULT_ROUTE)
  }

  render () {
    return (
      <PageContainerHeader
        onClose={() => this.onClose()}
        subtitle={this.context.t('orderInSwtc')}
        title={this.context.t('CreateOrder')}
      />
    )
  }

}
