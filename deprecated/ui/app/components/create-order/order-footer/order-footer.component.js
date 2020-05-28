import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PageContainerFooter from '../../page-container/page-container-footer'
import { DEFAULT_ROUTE } from '../../../routes'
import {  Descriptions,  Modal } from 'antd'

export default class OrderFooter extends Component {

  static propTypes = {
    orderAmount: PropTypes.string,
    orderDirection: PropTypes.string,
    orderSum: PropTypes.string,
    counter: PropTypes.string,
    createJccOrder: PropTypes.func,
    orderPassword: PropTypes.string,
    disabled: PropTypes.bool,
    errors: PropTypes.object,
    selectAddress: PropTypes.object,
    history: PropTypes.object,
    inError: PropTypes.bool,
    update: PropTypes.func,
    warning: PropTypes.object,
    jccWarning: PropTypes.string,
  }

  state = {
    sendErrorMsg: '',
    modalVisible: false,
  }

  static contextTypes = {
    t: PropTypes.func,
    metricsEvent: PropTypes.func,
  };

  onCancel () {
    this.props.clearSend()
    this.props.history.push(DEFAULT_ROUTE)
  }

  formShouldBeDisabled () {
    //const password = document.getElementById('password').value
    const { orderAmount, orderPrice } = this.props
    let shouldBeDisabled = true
    if(orderAmount > 0 && orderPrice > 0) {
      shouldBeDisabled = false
    }
    return shouldBeDisabled
  }

  onSubmitOrder = () => {
    const {
      from,
      orderAmount,
      orderDirection,
      orderPrice,
      counter,
      createJccOrder,
    } = this.props
    const { metricsEvent } = this.context
    const password = document.getElementById('orderpassword').value
    const promise = createJccOrder({ from, orderAmount, orderDirection, orderPrice, counter, password })
    Promise.resolve(promise)
      .then((result) => {
        metricsEvent({
          eventOpts: {
            category: 'Transactions',
            action: 'Edit Screen',
            name: 'Complete',
          },
        })
      })
  }

  cancelModal () {
    this.setState({
      modalVisible: true,
    })
  }

  render () {
    const {t} = this.context
    return (
      <div>
      <Modal
            title={t('confirmOrder')}
            visible={this.state.modalVisible}
            onOk={this.onSubmitOrder}
            onCancel={() => this.setState({modalVisible: false})}
            okText={t('ok')}
            cancelText={t('cancel')}
          >
            <Descriptions column={1}>
              <Descriptions.Item label={t('from')}>{this.props.from.address}</Descriptions.Item>
              <Descriptions.Item label={t('pair')}>{this.props.counter}</Descriptions.Item>
              <Descriptions.Item label={t('type')}>{this.props.orderDirection}</Descriptions.Item>
              <Descriptions.Item label={t('amount')}>{this.props.orderAmount}</Descriptions.Item>
              <Descriptions.Item label={t('price')}>{this.props.orderPrice}</Descriptions.Item>
            </Descriptions>
        </Modal>
      <PageContainerFooter
        onCancel={() => this.onCancel()}
        onSubmit={() => this.setState({
          modalVisible: true,
        })}
        disabled={this.formShouldBeDisabled()}
      />
      </div>
    )
  }

}
