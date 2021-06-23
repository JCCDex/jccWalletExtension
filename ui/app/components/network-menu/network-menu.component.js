import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash.debounce'
import { Menu, Item, Divider } from '../dropdowns/components/menu'
import Tooltip from '../tooltip'
import UserPreferencedCurrencyDisplay from '../user-preferenced-currency-display'
import { PRIMARY } from '../../constants/common'
const h = require('react-hyperscript')
export default class NetworkMenu extends PureComponent {
    static contextTypes = {
        t: PropTypes.func,
        metricsEvent: PropTypes.func,
      }

      static propTypes = {
        isNetworkMenuOpen: PropTypes.bool,
        isWalletTypeMenuOpen: PropTypes.bool,
        isAccountMenuOpen: PropTypes.bool,

        toggleAccountMenu: PropTypes.func,
        toggleWalletTypeMenu: PropTypes.func,
        toggleNetworkMenu: PropTypes.func,
        selectedWalletType:PropTypes.string,
        Networks:PropTypes.array,
        selectedNetWork:PropTypes.object
      }

      skipToNetworkManage(){
        const {history} = this.props;
        
      }

      renderNetWorkList(){
        const {Networks,selectedNetWork,selectedWalletType} = this.props;
        console.log(selectedNetWork.url)

        const NetworkList = Networks[selectedWalletType].map((network,key)=>
          <div className='network-menu__Item' key ={key}>
            <div className='network-menu__Item__font'>
              {network.name}
            </div>
                
            {
            selectedNetWork.url == network.url?(
              <img
              className="network-menu__Item__icon"
              onClick={()=>{
                this.setNetwork(network)
              }}
              src="images/selected.png"
              height={10}
              width={14}
            />
              ):(
              <div></div>)
          }


          </div>
        )

        return (<div> 
        {NetworkList}
       </div>)
      }
       

      render(){
        const {isNetworkMenuOpen} = this.props
        const { t } = this.context
        
        return (
            <Menu
            className="network-menu"
            isShowing={isNetworkMenuOpen}
            >
              {this.renderNetWorkList()}
              <div className='network-menu__add-network'
                onClick={this.skipToNetworkManage()}>
                <div className='network-menu__Item__font'>
                {t('addNetwork')}
                </div>
              </div>
            </Menu>
        )
      }
}
            
    