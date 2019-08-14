import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import TransactionListItem from '../transaction-list-item'
const Jccutils = require('../../components/send/jccutils')
import { Tabs } from 'antd'
import { Table, Button, Input, Modal, Alert, Progress, Checkbox } from 'antd';


export default class TransactionList extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
  }

  componentWillMount () {
    const { selectedAddress } = this.props
    console.log('willMount')
    this.getCommissionOrder(selectedAddress)
    this.getHistoricPayments(selectedAddress)
    this.getHistoricTransactions(selectedAddress)
  }
 
  componentWillReceiveProps (nextProps) {
   
    if (this.props.selectedAddress !== nextProps.selectedAddress) {
      console.log('nextProps.selectedAddress:'+nextProps.selectedAddress)
      this.getCommissionOrder(nextProps.selectedAddress)
      this.getHistoricPayments(nextProps.selectedAddress)
      this.getHistoricTransactions(nextProps.selectedAddress)
    }
  }

  static propTypes = {
    selectedToken: PropTypes.object,
    selectedAddress: PropTypes.string,
    assetImages: PropTypes.object,
  }

  state = {
    historyTransactions: [],
    completedTransactions: [],
    commissionTransaction: [],
    dealTransaction: [],
    cancelTransaction: [],
    modalVisible: false,
    sequence: '',
    successVisible: false,
    failVisible: false,
    failMessage: '',
    percent: 0,
  }

  renderTransactions () { 
   const { TabPane } = Tabs
    const { t } = this.context
   
    return (
      <div className="transaction-list__transactions">
        <div className="transaction-list__completed-transactions">
          {/* <div className="transaction-list__header">
            { t('history') }
          </div> */}
          <div>
            <Tabs onChange={(key) => this.tabsChange(key)} defaultActiveKey="1">
            <TabPane tab={t('transfer')} key="1">
            {
              this.state.completedTransactions.length > 0
                ? this.renderTransaction(this.state.completedTransactions): this.renderEmpty()
            }
            </TabPane>
            <TabPane tab={t('current_commission')} key="2">
            {
              this.state.commissionTransaction.length > 0
                ? this.renderCommissionTransaction(this.state.commissionTransaction): this.renderEmpty()
            }
            </TabPane>
            <TabPane tab={t('transaction_record')} key="3">
            {
              this.state.historyTransactions.length > 0
                ? this.renderHistoryTransaction(this.state.historyTransactions): this.renderEmpty()
            }
            </TabPane>
          </Tabs>
          </div>
          
          
        </div>
      </div>
    )
 // }
}
  
  tabsChange (activeKey) {
    const { selectedAddress } = this.props
    if (activeKey == 1 ) {
      this.getHistoricPayments(selectedAddress)
    }
    if(activeKey == 2) {
      this.getCommissionOrder(selectedAddress)
    }
    if(activeKey == 3) {
      this.getHistoricTransactions(selectedAddress)
    }
  }

  getHistoricPayments (selectedAddress) {
    const jccutils = new Jccutils()
    jccutils.getHistoricPayments(selectedAddress).then((res) => {
      if (res.result) {
       this.setState({ completedTransactions: res.data.transactions })
      }
    })
  }

  getHistoricTransactions (selectedAddress) {
    const jccutils = new Jccutils()
    const { t } = this.context
    jccutils.getHistoricTransactions(selectedAddress).then((res) => {
      if (res.result) {
        const trans = res.data.transactions
        let temp = []
        trans.map((ta,index) => {
              let timeToDate = new Date(ta.time*1000).toLocaleString()
              timeToDate = timeToDate.split("/").join('-');
              let state = ta.status
              if(state == 'offer_bought'){
                state = t('offer_bought')
              }else if(state == 'offer_funded'){
                state = t('offer_funded')
              }else if(state == 'offer_partially_funded'){
                state = t('offer_partially_funded')
              }else if(state == 'offer_cancelled'){
                state = t('offer_cancelled')
              }else if(state == 'offer_created'){
                state = t('offer_created')
              }
              let type = ta.type
              if(type == 'buy'){
                ta.type = t('buy')
              }else if(type == 'sell'){
                ta.type = t('sell')
              }
              ta.status = state
              ta.key = index
              ta.price = Number(ta.price).toFixed(4)
              ta.amount = Number(ta.amount).toFixed(4)
              ta.time = timeToDate
              temp.push(ta)   
        })
       this.setState({ historyTransactions: temp })
      }
    })
  }

  getCommissionOrder (selectedAddress) {
    const jccutils = new Jccutils()
    jccutils.getOrders(selectedAddress).then((res) => {
      if(res.result) {
        const trans = res.data
        let temp = []
        trans.map((ta,index) => {
              ta.key = index
              ta.pair = ta.pair.split("+")[0]
              ta.price = Number(ta.price).toFixed(4)
              ta.amount = Number(ta.amount).toFixed(4)
              temp.push(ta)   
        })
        const sortedTemp = temp.sort(this.compare('sequence'))
        this.setState({ commissionTransaction: sortedTemp})
      }
    })
  }

  getCancelCommissionOrder (selectedAddress) {
    this.setState({ percent: 90})
    const jccutils = new Jccutils()
    jccutils.getOrders(selectedAddress).then((res) => {
      if(res.result) {
        const trans = res.data
        let temp = []
        trans.map((ta,index) => {
              ta.key = index
              ta.pair = ta.pair.split("+")[0]
              ta.price = Number(ta.price).toFixed(4)
              ta.amount = Number(ta.amount).toFixed(4)
              temp.push(ta)   
        })
        const sortedTemp = temp.sort(this.compare('sequence'))
        this.setState({ percent: 100})
        this.setState({ commissionTransaction: sortedTemp})
        
      }
    })
  }

  compare (property) {
    return function(a,b) {
      let value1 = a[property]
      let value2 = b[property]
      return value2 - value1
    }
  }

  renderTransaction (transactionGroup) {
    const { t } = this.context
   let swtcscan = 'https://swtcscan.jccdex.cn/#/trade/tradeDetail/?hash='
   const columns = [
    {
      title: t('transaction_time'),
      dataIndex: 'time',
      key: 'time',
      render: (text, record) => (
        <span>
          {
           new Date(record.time*1000).toLocaleString().split("/").join('-')
          }
        </span>
      ),
    },
    {
      title: t('sender'),
      dataIndex: 'sender',
      key: 'sender',
    },
    {
      title: t('receiver'),
      dataIndex: 'receiver',
      key: 'receiver',
    },
    {
      title: t('currency'),
      dataIndex: 'currency',
      key: 'currency',
    },
    {
      title: t('amount'),
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: t('transaction_hash'),
      dataIndex: 'hash',
      key: 'hash',
      render: (text, record) => <a href={swtcscan + text}>{text}</a>,
    },
    ]
    return (
     // <TransactionListItem
     //   transaction={transactionGroup}
     //   key={`${index}`}
     // />
     <div>
     <Table size={'small'} scroll={{ x: 1500 }} dataSource={transactionGroup} columns={columns} />
   </div>
    )
  }

  renderCommissionTransaction (transactionGroup) {
    const { t } = this.context
    const columns = [
      {
        title: t('type'),
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: t('pair'),
        dataIndex: 'pair',
        key: 'pair',
      },
      {
        title: t('price'),
        dataIndex: 'price',
        key: 'price',
      },
      {
        title: t('amount'),
        dataIndex: 'amount',
        key: 'amount',
      },
      {
        title: t('action'),
        key: 'action',
        render: (text, record) => (
          this.state.successVisible && this.state.sequence == record.sequence?<Progress type="circle" width={30} percent={this.state.percent} />:
            <Button type="link" onClick={this.showModal.bind(this,record)}>撤销</Button>
        ),
      },
    ]
     return (
       <div>
        <Table scroll={{ x: 450 }} dataSource={transactionGroup} columns={columns} />
        <Modal
            title={t('inputPassword')}
            visible={this.state.modalVisible}
            onOk={this.cancelOrder}
            onCancel={this.handleCancel}
            okText={t('ok')}
            cancelText={t('cancel')}
          >
            <Input.Password id="cancelPwd" addonBefore={t('password')} placeholder={t('inputPassword')} />
           {/*  <Checkbox onChange={passpwd}>15分钟内免输入密码</Checkbox> */}
        </Modal>
        {this.state.successVisible ? (<Alert message="撤销成功" closable="true" type="success" banner/>) : null }
        {this.state.failVisible ? (<Alert message={this.state.failMessage} colsable="true" type="error" banner/>) : null }
      </div>
      
     )
   }

   passpwd(e) {
    console.log(`checked = ${e.target.checked}`);
    if(e.target.checked){

    }
   }
   renderHistoryTransaction (transactionGroup) {
    const { t } = this.context
    const columns = [
      {
        title: t('transaction_time'),
        dataIndex: 'time',
        key: 'time',
      },
      {
        title: t('pair'),
        dataIndex: 'pairs',
        key: 'pairs',
      },
      {
        title: t('type'),
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: t('price'),
        dataIndex: 'price',
        key: 'price',
      },
      {
        title: t('amount'),
        dataIndex: 'amount',
        key: 'amount',
      },
      {
        title: t('transaction_status'),
        dataIndex: 'status',
        key: 'status',
      },
    ]
     return (
       <div>
        <Table scroll={{ x: 600 }} dataSource={transactionGroup} columns={columns} />
      </div>
      
     )
   }

   showModal = (record) => {
    this.setState({
      modalVisible: true,
      sequence: record.sequence,
    })
  }

  handleOk = e => {
    this.setState({
      modalVisible: false,
    })
  }

  handleCancel = e => {
    this.setState({
      modalVisible: false,
    })
  }

   cancelOrder = async e => {
    const pwd = document.getElementById("cancelPwd").value
    const jccutils = new Jccutils()
    const { selectedAddress } = this.props
    let hash 
    let errorMsg
    try {
      hash = await jccutils.cancelOrder(selectedAddress,this.state.sequence,pwd)
    } catch (error) {
      errorMsg = error
    }
    if (hash) {
      this.setState({
        successVisible: true,
      })
    }else {
      this.setState({
        failMessage: errorMsg,
        failVisible: true,
      })
    }
    this.setState({
      modalVisible: false,
      percent: 50,
    })
    setTimeout(() => this.getCancelCommissionOrder(selectedAddress), 9000)
    }

  renderEmpty () {
    return (
      <div className="transaction-list__empty">
        <div className="transaction-list__empty-text">
          { this.context.t('noTransactions') }
        </div>
      </div>
    )
  }

  render () {
    return (
      <div className="transaction-list">
        { this.renderTransactions() }
      </div>
    )
  }
}
