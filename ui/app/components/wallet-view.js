const Component = require('react').Component
const PropTypes = require('prop-types')
const connect = require('react-redux').connect
const h = require('react-hyperscript')
const { withRouter } = require('react-router-dom')
const { compose } = require('recompose')
const inherits = require('util').inherits
const classnames = require('classnames')
import Identicon from './identicon'
// const AccountDropdowns = require('./dropdowns/index.js').AccountDropdowns
const Tooltip = require('./tooltip-v2.js').default
const copyToClipboard = require('copy-to-clipboard')
const actions = require('../actions')
import BalanceComponent from './balance'
const TokenList = require('./token-list')
const selectors = require('../selectors')

module.exports = compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(WalletView)

WalletView.contextTypes = {
  t: PropTypes.func,
  metricsEvent: PropTypes.func,
}

WalletView.defaultProps = {
  responsiveDisplayClassname: '',
}

function mapStateToProps (state) {

  return {
    sidebarOpen: state.appState.sidebar.isOpen,
    identities: state.metamask.identities,
    accounts: selectors.getMetaMaskAccounts(state),
    keyrings: state.metamask.keyrings,
    selectedAddress: selectors.getSelectedAddress(state),
    selectedAccount: selectors.getSelectedAccount(state),
    selectedTokenAddress: state.metamask.selectedTokenAddress,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    showSendPage: () => dispatch(actions.showSendPage()),
    hideSidebar: () => dispatch(actions.hideSidebar()),
    unsetSelectedToken: () => dispatch(actions.setSelectedToken()),
    showAccountDetailModal: () => {
      dispatch(actions.showModal({ name: 'ACCOUNT_DETAILS' }))
    },
   
  }
}

inherits(WalletView, Component)
function WalletView () {
  Component.call(this)
  this.state = {
    hasCopied: false,
    copyToClipboardPressed: false,
  }
}

WalletView.prototype.renderWalletBalance = function () {
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


WalletView.prototype.render = function () {
  const {
    responsiveDisplayClassname,
    selectedAddress,
    showAccountDetailModal,
    hideSidebar,
    identities,
  } = this.props
  // temporary logs + fake extra wallets


  if (!selectedAddress) {
    throw new Error('selectedAddress should not be ' + String(selectedAddress))
  }


  let label = ''

  label = this.context.t('imported')

  

  return h('div.wallet-view.flex-column', {
    style: {},
    className: responsiveDisplayClassname,
  }, [

    // TODO: Separate component: wallet account details
    h('div.flex-column.wallet-view-account-details', {
      style: {},
    }, [
      h('div.wallet-view__sidebar-close', {
        onClick: hideSidebar,
      }),

      h('div.wallet-view__keyring-label.allcaps', label),

      h('div.flex-column.flex-center.wallet-view__name-container', {
        style: { margin: '0 auto' },
        onClick: showAccountDetailModal,
      }, [
        h(Identicon, {
          diameter: 54,
          address: selectedAddress,
        }),

        h('span.account-name', {
          style: {},
        }, [
          identities[selectedAddress].name,
        ]),

        h('button.btn-clear.wallet-view__details-button.allcaps', this.context.t('details')),
      ]),
    ]),

    h(Tooltip, {
      position: 'bottom',
      title: this.state.hasCopied ? this.context.t('copiedExclamation') : this.context.t('copyToClipboard'),
      wrapperClassName: 'wallet-view__tooltip',
    }, [
      h('button.wallet-view__address', {
        className: classnames({
          'wallet-view__address__pressed': this.state.copyToClipboardPressed,
        }),
        onClick: () => {
          copyToClipboard(selectedAddress)
          this.context.metricsEvent({
            eventOpts: {
              category: 'Navigation',
              action: 'Home',
              name: 'Copied Address',
            },
          })
          this.setState({ hasCopied: true })
          setTimeout(() => this.setState({ hasCopied: false }), 3000)
        },
        onMouseDown: () => {
          this.setState({ copyToClipboardPressed: true })
        },
        onMouseUp: () => {
          this.setState({ copyToClipboardPressed: false })
        },
      }, [
        `${selectedAddress.slice(0, 6)}...${selectedAddress.slice(-4)}`,
        h('i.fa.fa-clipboard', { style: { marginLeft: '8px' } }),
      ]),
    ]),
   
    this.renderWalletBalance(),

    h(TokenList),

  //  this.renderAddToken(),
  ])
}

// TODO: Extra wallets, for dev testing. Remove when PRing to master.
// const extraWallet = h('div.flex-column.wallet-balance-wrapper', {}, [
//     h('div.wallet-balance', {}, [
//       h(BalanceComponent, {
//         balanceValue: selectedAccount.balance,
//         style: {},
//       }),
//     ]),
// ])
