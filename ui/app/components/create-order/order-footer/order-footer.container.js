import { connect } from 'react-redux'
import {
  clearSend,
  createJccOrder,
} from '../../../actions'
import OrderFooter from './order-footer.component'
import {
  getOrderAmount,
  getOrderDirection,
  getOrderPrice,
  getOrderCounter,
  getOrderPassword,
  getSelectedAddress,
  getJccSendWarnings,
  getOrderFromObject,
  getAccount,
} from '../order.selectors'
const selectors = require('../../../selectors')


export default connect(mapStateToProps, mapDispatchToProps)(OrderFooter)

function mapStateToProps (state) {
  return {
    from: getOrderFromObject(state),
    orderAmount: getOrderAmount(state),
    orderDirection: getOrderDirection(state),
    orderPrice: getOrderPrice(state),
    counter: getOrderCounter(state),
    orderPassword: getOrderPassword(state),
    selectAddress: getSelectedAddress(state),
    jccWarning: getJccSendWarnings(state),
  //  warning: state.appState.warning,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    clearSend: () => dispatch(clearSend()),
    createJccOrder: ({ from, orderAmount, orderDirection, orderPrice, counter, password }) => {
      let ct = counter.split('/')[1]
      let base = counter.split('/')[0]
      if (ct == 'swtc') {
        ct = 'swt'
      }
      if (ct == 'cnt') {
        ct = 'cny'
      }
      if (base == 'swtc') {
        base = 'swt'
      }
      const txParams = {
        counter: ct,
        base: base,
        issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
        address: from.address,
        type: orderDirection,
        amount: orderAmount,
        sum: orderPrice*orderAmount,
       // secret: secret,
       // hosts: hosts,
       // port: port,
       // https: true,
      }
     // console.dir(state.metamask.tokens)
      dispatch(createJccOrder(from, txParams, password))
    },
  }
}
