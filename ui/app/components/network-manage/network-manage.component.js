import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Menu} from '../dropdowns/components/menu'
export default class NetworkManage extends PureComponent {
    static contextTypes = {
        t: PropTypes.func,
        metricsEvent: PropTypes.func,
      }
    static propTypes = {
        setNetwork:PropTypes.func,
        addNetwork:PropTypes.func,
        deleteNetwork:PropTypes.func,
        updateNetwork:PropTypes.func,

        networks:PropTypes.object,
        selectedWalletType:PropTypes.string,
        selectedNetWork:PropTypes.object,
    }



    render(){
        return (
            <div>
                {是瓦片}
            </div>
        )
    }

}