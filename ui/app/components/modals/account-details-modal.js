const Component = require('react').Component
const PropTypes = require('prop-types')
const h = require('react-hyperscript')
const inherits = require('util').inherits
const connect = require('react-redux').connect
const actions = require('../../actions')
const AccountModalContainer = require('./account-modal-container')
const { getSelectedIdentity } = require('../../selectors')
const QrView = require('../qr-code')
const EditableLabel = require('../editable-label')

import Button from '../button'

function mapStateToProps (state) {
  return {
    network: state.metamask.network,
    selectedWalletType:state.metamask.selectedWalletType,
    selectedIdentity: getSelectedIdentity(state),
    keyrings: state.metamask.keyrings,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    // Is this supposed to be used somewhere?
    showQrView: (selected, identity) => dispatch(actions.showQrView(selected, identity)),
    showExportPrivateKeyModal: () => {
      dispatch(actions.showModal({ name: 'EXPORT_PRIVATE_KEY' }))
    },
    hideModal: () => dispatch(actions.hideModal()),
    setAccountLabel: (walletType,address, label) => dispatch(actions.setAccountLabel(walletType ,address, label)),
  }
}

inherits(AccountDetailsModal, Component)
function AccountDetailsModal () {
  Component.call(this)
}

AccountDetailsModal.contextTypes = {
  t: PropTypes.func,
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(AccountDetailsModal)


// Not yet pixel perfect todos:
  // fonts of qr-header

AccountDetailsModal.prototype.render = function () {
  const {
    selectedIdentity,
    network,
    showExportPrivateKeyModal,
    setAccountLabel,
    selectedWalletType
  } = this.props
  const { name, address } = selectedIdentity

  //const keyring = keyrings.find((kr) => {
  //  return kr.accounts.includes(address)
 // })

  const exportPrivateKeyFeatureEnabled = true
  // This feature is disabled for hardware wallets
 // if (keyring && keyring.type.search('Hardware') !== -1) {
  // exportPrivateKeyFeatureEnabled = false
//  }

  return h(AccountModalContainer, {}, [
      h(EditableLabel, {
        className: 'account-modal__name',
        defaultValue: name,
        onSubmit: label => setAccountLabel(selectedWalletType,address, label),
      }),

      h(QrView, {
        Qr: {
          data: address,
          network: network,
        },
      }),

      h('div.account-modal-divider'),


      // Holding on redesign for Export Private Key functionality

      exportPrivateKeyFeatureEnabled ? h(Button, {
        type: 'primary',
        className: 'account-modal__button',
        onClick: () => showExportPrivateKeyModal(),
      }, this.context.t('exportPrivateKey')) : null,

  ])
}
