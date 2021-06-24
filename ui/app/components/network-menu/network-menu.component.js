import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Menu} from '../dropdowns/components/menu'
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
        networks:PropTypes.array,
        selectedNetWork:PropTypes.object,
        setNetwork:PropTypes.func
      }

      skipToNetworkManage(){
      //  const {history} = this.props;
      //  history.push(NETWORK_MANAGE)
      }

      async setCurrentNetwork(network){
        const {setNetwork,selectedWalletType} = this.props
        await setNetwork(selectedWalletType,network);
      }

      renderNetWorkList(){
        const {networks,selectedNetWork,selectedWalletType} = this.props;
        let selectedNet =  selectedNetWork[selectedWalletType]
        console.log(selectedNet)
        console.log(selectedWalletType)
        console.log(selectedNetWork)
        console.log(networks)
        const NetworkList = networks[selectedWalletType].map((network,key)=>
          <div className='network-menu__Item' key ={key}
            onClick={()=>{
              this.setCurrentNetwork(network)
            }}>
            <div className='network-menu__Item__font'>
              {network.name}
            </div>
                
            {
            selectedNet.url === network.url?(
              <img
              className="network-menu__Item__icon"
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
            
    