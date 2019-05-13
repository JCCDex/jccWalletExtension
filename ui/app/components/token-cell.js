const Component = require('react').Component
const PropTypes = require('prop-types')
const h = require('react-hyperscript')
const inherits = require('util').inherits
const connect = require('react-redux').connect
const selectors = require('../selectors')
const actions = require('../actions')


function mapStateToProps (state) {
  return {
    currentCurrency: state.metamask.currentCurrency,
    selectedTokenAddress: state.metamask.selectedTokenAddress,
    userAddress: selectors.getSelectedAddress(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setSelectedToken: address => dispatch(actions.setSelectedToken(address)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(TokenCell)

inherits(TokenCell, Component)
function TokenCell () {
  Component.call(this)
}

TokenCell.contextTypes = {
  metricsEvent: PropTypes.func,
}

TokenCell.prototype.render = function () {
  const props = this.props
  const {
    address,
    cur,
    val,
    setSelectedToken,
    selectedTokenAddress,
   // hideSidebar,
   // sidebarOpen,
    // userAddress,
   // image,
  } = props

  return (
    h('div.token-list-item', {
      className: `token-list-item ${selectedTokenAddress === address ? 'token-list-item--active' : ''}`,
      // style: { cursor: network === '1' ? 'pointer' : 'default' },
      // onClick: this.view.bind(this, address, userAddress, network),
      onClick: () => {
        setSelectedToken(address)
        this.context.metricsEvent({
          eventOpts: {
            category: 'Navigation',
            action: 'Token Menu',
            name: 'Clicked Token',
          },
        })
        selectedTokenAddress !== address
      },
    }, [

      h('div.token-list-item__balance-ellipsis', null, [
        h('div.token-list-item__balance-wrapper', null, [
          h('div.token-list-item__token-balance', `${val || 0}`),
          h('div.token-list-item__token-symbol', cur),
        ]),
      ]),


      /*
      h('button', {
        onClick: this.send.bind(this, address),
      }, 'SEND'),
      */

    ])
  )
}
