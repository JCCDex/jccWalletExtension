import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
const h = require('react-hyperscript')
const classnames = require('classnames')
const Tooltip = require('../tooltip-v2.js').default
import BalanceComponent from '../balance'
import copyToClipboard from 'copy-to-clipboard'

//等同 preferences 定义的ChainType 
//整个系统中 ChainType == walletType == NetworkType  注 ： 对钱包应用来说 链类型只和 钱包的本地化 操作有关。其他均无关。
const WALLET_TYPE_MAP = {
  jingtum: 'jingtum',
  eth: 'eth',
}

export default class WalletView extends PureComponent {


  constructor (props) {
    super(props)
    this.state = {
      seletcedType : WALLET_TYPE_MAP.jingtum,
      close : false,
      copyToClipboardPressed: false,
    }
  }

  static propTypes = {
    useNativeCurrencyAsPrimaryCurrency: PropTypes.bool,
    wallets:PropTypes.object,
    ChainTypeList:PropTypes.array,
    selectedWalletType:PropTypes.string,
    setSelectedWalletType:PropTypes.func,
  }

  changeType(seletcedType){
    this.setState(state => {
      return {
        seletcedType
      }
    })
  }

  getBalance(address){
    return 100
  }
  static contextTypes = {
    t: PropTypes.func,
    metricsEvent: PropTypes.func,
  }

  defaultProps = {
    responsiveDisplayClassname: '',
  }

  renderWalletBalance() {
    const {
      selectedTokenAddress,
      selectedAccount,
      unsetSelectedToken,
      hideSidebar,
      sidebarOpen,
    } = this.props
  
    const selectedClass = selectedTokenAddress
      ? ''
      : 'wallet-balance-wrapper--active'
    const className = `flex-column wallet-balance-wrapper ${selectedClass}`
  
    return h('div', { className }, [
      h('div.wallet-balance',
        {
          onClick: () => {
            unsetSelectedToken()
            selectedTokenAddress && sidebarOpen && hideSidebar()
          },
        },
        [
          h(BalanceComponent, {
            balanceValue: selectedAccount ? selectedAccount.balance : '',
            style: {},
          }),
        ]
      ),
    ])
  }


  skipToWalletManage(){
    hideSidebar()

  }


  skipToAddWallet(){
    hideSidebar()
    
  }


  //设置主页面显示的 钱包
  //1 初始化 钱包类型对应的 节点
  //2 设置界面显示 的几个 prefaceController 属性
  //3 设置当前钱包类型
  setAccount(){
    
  }

  renderWalletList(){
    const {t} = this.context;
    const {identities,selectedAccount,selectedWalletType} = this.props

    return Object.keys(identities).map((key, index)=>{
      return identities[key].type === this.state.seletcedType?  
       <div className='wallet-view__wallet' key={index} >
        <div className='wallet-view__wallet__item'>
          <div className='wallet-view__wallet__name__font'>
            {identities[key].name}
          </div>
          {
            identities[key].address == selectedAccount.address?(
              <div className='wallet-view__wallet__name__default'>
                {t('current')}
              </div>
              ):(
              <div></div>)
          }
          <img
              className="wallet-view__wallet__name__iocn"
              onClick={()=>{
                this.skipToWalletManage(identities[key].address)
              }}
              src="images/swap.png"
              height={14}
              width={8}
            />
        </div>

        <div className='wallet-view__wallet__item'>
        <Tooltip
            position="bottom"
            title={this.state.copied ? t('copiedExclamation') : t('copyToClipboard')}
          >
            <div className='wallet-view__wallet__address__font'
            onClick={()=>{
              this.setState({ copied: true })
              setTimeout(() => this.setState({ copied: false }), 3000)
              copyToClipboard(key)
            }}>
              {key.length< 22? key:key.substring(0,7)+"..."+key.substring(key.length-8,key.length)}
            </div>
          </Tooltip>
            <img
              className="wallet-view__wallet__address"
              src="images/copy.png"
              height={12}
              width={12}
            />
        </div>

        <div className='wallet-view__wallet__item'>
        <div className='wallet-view__wallet__address__font'>
             {this.getBalance(key)}
          </div>
        </div>
      </div>:null
    })
  }

  renderTypeList(){
    const {ChainTypeList,selectedWalletType} = this.props;
    const TypeList = ChainTypeList.map((item,key)=>
    <div className='wallet-view__wallet_type_list__Item' 
      key={key} 
      onClick={() => {this.changeType(item.ChainType)}}>
      <img
        src={this.state.seletcedType == item.ChainType ? item.IconUrl+"_select.png" :item.IconUrl+'.png'}
        height={32}
        width={32}
      />    
    </div>
    )
    return (
    <div>
     {TypeList}
    </div>)
  }


  render () {
    const {
      responsiveDisplayClassname,
      selectedAddress,
      hideSidebar,
      selectedWalletType,
    } = this.props
    // temporary logs + fake extra wallets
    const { t } = this.context
    if (!selectedAddress) {
      throw new Error('selectedAddress should not be ' + String(selectedAddress))
    }

    return (
      <div className ={classnames('wallet-view flex-column', responsiveDisplayClassname)} >
        <div className='wallet-view__head-wapper'>
          <div className='wallet-view__head-container'>
              <img
                className="wallet-view__head-container__wallet--icon"
                src="/images/walletTip.png"
                height={16}
                width={16}
              />
              <div className='wallet-view__head-container__title'>
                {t('WalletList')}
              </div>
              <img
                className="wallet-view__head-container__back--icon"
                src="images/close.png"
                onClick= {hideSidebar}
                height={14}
                width={14}
              />
            </div>
            <hr className='title-bar__title__separator' />
        </div>

        <div className='wallet-view__body-wappet'>  
              <div className='wallet-view__wallet_type_list'>
              {this.renderTypeList()}
              </div>
              <div className='wallet-view__wallets'>
                <div className='wallet-view__wallets__title' >
                  <div className='wallet-view__wallets__title__font' >
                    {this.state.seletcedType  == "jingtum"?t('jingtum'):t('eth')}
                  </div>
                  <img
                    className="wallet-view__wallets__title__icon"
                    src="images/add.png"
                    onClick={()=>{
                      this.skipToAddWallet(wallet)
                    }}
                    height={16}
                    width={16}
                  />
                </div>
                {this.renderWalletList()}
                <div className='wallet-view__wallet'
                 onClick={this.skipToAddWallet}>
                      {t('AddWallet')}
                </div>
              </div>
          </div>
      </div>
    )
    
  }
}