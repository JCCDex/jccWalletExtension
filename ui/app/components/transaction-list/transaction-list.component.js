import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import TransactionListItem from '../transaction-list-item'
const Jccutils = require('../../components/send/jccutils')
import { Tabs } from 'antd'
import { Table, Button, Input, Modal, Alert, Progress } from 'antd';


export default class TransactionList extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
  }

  componentWillMount () {
    const { selectedAddress } = this.props
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
            <TabPane tab="转账" key="1">
            {
              this.state.completedTransactions.length > 0
                ? this.renderTransaction(this.state.completedTransactions): this.renderEmpty()
            }
            </TabPane>
            <TabPane tab="当前委托" key="2">
            {
              this.state.commissionTransaction.length > 0
                ? this.renderCommissionTransaction(this.state.commissionTransaction): this.renderEmpty()
            }
            </TabPane>
            <TabPane tab="交易记录" key="3">
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
    jccutils.getHistoricTransactions(selectedAddress).then((res) => {
      if (res.result) {
        const trans = res.data.transactions
        let temp = []
        trans.map((ta,index) => {
              let timeToDate = new Date(ta.time*1000).toLocaleString()
              timeToDate = timeToDate.split("/").join('-');
              let state = ta.status
              if(state == 'offer_bought'){
                state = '主动成交'
              }else if(state == 'offer_funded'){
                state = '被动成交'
              }else if(state == 'offer_partially_funded'){
                state = '部分成交'
              }else if(state == 'offer_cancelled'){
                state = '取消挂单'
              }else if(state == 'offer_created'){
                state = '创建挂单'
              }
              let type = ta.type
              if(type == 'buy'){
                ta.type = '买入'
              }else if(type == 'sell'){
                ta.type = '卖出'
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
        console.log('temp:')
        console.dir(temp)
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
   let swtcscan = 'https://swtcscan.jccdex.cn/#/trade/tradeDetail/?hash='
   const columns = [
    {
      title: '交易时间',
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
      title: '发起方',
      dataIndex: 'sender',
      key: 'sender',
    },
    {
      title: '交易对家',
      dataIndex: 'receiver',
      key: 'receiver',
    },
    {
      title: '币种',
      dataIndex: 'currency',
      key: 'currency',
    },
    {
      title: '数量',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: '交易hash',
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
    const columns = [
      {
        title: '方向',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: '交易对',
        dataIndex: 'pair',
        key: 'pair',
      },
      {
        title: '价格',
        dataIndex: 'price',
        key: 'price',
      },
      {
        title: '数量',
        dataIndex: 'amount',
        key: 'amount',
      },
      {
        title: 'Action',
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
            title="请输入密码"
            visible={this.state.modalVisible}
            onOk={this.cancelOrder}
            onCancel={this.handleCancel}
            okText="确认"
            cancelText="取消"
          >
            <Input.Password id="cancelPwd" addonBefore="密码" placeholder="input password" />
        </Modal>
        {this.state.successVisible ? (<Alert message="撤销成功" closable="true" type="success" banner/>) : null }
        {this.state.failVisible ? (<Alert message={this.state.failMessage} colsable="true" type="error" banner/>) : null }
      </div>
      
     )
   }

   renderHistoryTransaction (transactionGroup) {
    const columns = [
      {
        title: '交易时间',
        dataIndex: 'time',
        key: 'time',
      },
      {
        title: '交易对',
        dataIndex: 'pairs',
        key: 'pairs',
      },
      {
        title: '方向',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: '价格',
        dataIndex: 'price',
        key: 'price',
      },
      {
        title: '数量',
        dataIndex: 'amount',
        key: 'amount',
      },
      {
        title: '交易状态',
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
    setTimeout(() => this.getCancelCommissionOrder(selectedAddress), 8000)
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
