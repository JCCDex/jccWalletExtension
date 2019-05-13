const inherits = require('util').inherits
const Component = require('react').Component
const PropTypes = require('prop-types')
const h = require('react-hyperscript')
const connect = require('react-redux').connect
const actions = require('../actions')
const { formatDate } = require('../util')

const CopyButton = require('./copyButton')
const Tooltip = require('./tooltip')


ShiftListItem.contextTypes = {
  t: PropTypes.func,
}

module.exports = connect(mapStateToProps)(ShiftListItem)


function mapStateToProps (state) {
  return {
    selectedAddress: state.metamask.selectedAddress,
    conversionRate: state.metamask.conversionRate,
    currentCurrency: state.metamask.currentCurrency,
  }
}

inherits(ShiftListItem, Component)

function ShiftListItem () {
  Component.call(this)
}

ShiftListItem.prototype.render = function () {
  return h('div.transaction-list-item.tx-list-clickable', {
    style: {
      paddingTop: '20px',
      paddingBottom: '20px',
      justifyContent: 'space-around',
      alignItems: 'center',
      flexDirection: 'row',
    },
  }, [
    h('div', {
      style: {
        width: '0px',
        position: 'relative',
        bottom: '19px',
      },
    }, [
      h('img', {
        src: 'https://shapeshift.io/logo.png',
        style: {
          height: '35px',
          width: '132px',
          position: 'absolute',
          clip: 'rect(0px,30px,34px,0px)',
        },
      }),
    ]),

    this.renderInfo(),
    this.renderUtilComponents(),
  ])
}

ShiftListItem.prototype.renderUtilComponents = function () {
  var props = this.props

  switch (props.response.status) {
    case 'no_deposits':
      return h('.flex-row', [
        h(CopyButton, {
          value: this.props.depositAddress,
        }),
        h(Tooltip, {
          title: this.context.t('qrCode'),
        }, [
          h('i.fa.fa-qrcode.pointer.pop-hover', {
            onClick: () => props.dispatch(actions.reshowQrCode(props.depositAddress, props.depositType)),
            style: {
              margin: '5px',
              marginLeft: '23px',
              marginRight: '12px',
              fontSize: '20px',
              color: '#F7861C',
            },
          }),
        ]),
      ])
    case 'received':
      return h('.flex-row')

    case 'failed':
      return ''
    default:
      return ''
  }
}

ShiftListItem.prototype.renderInfo = function () {
  var props = this.props
  switch (props.response.status) {
    case 'no_deposits':
      return h('.flex-column', {
        style: {
          overflow: 'hidden',
        },
      }, [
        h('div', {
          style: {
            fontSize: 'x-small',
            color: '#ABA9AA',
            width: '100%',
          },
        }, this.context.t('toETHviaShapeShift', [props.depositType])),
        h('div', this.context.t('noDeposits')),
        h('div', {
          style: {
            fontSize: 'x-small',
            color: '#ABA9AA',
            width: '100%',
          },
        }, formatDate(props.time)),
      ])
    case 'received':
      return h('.flex-column', {
        style: {
          width: '200px',
          overflow: 'hidden',
        },
      }, [
        h('div', {
          style: {
            fontSize: 'x-small',
            color: '#ABA9AA',
            width: '100%',
          },
        }, this.context.t('toETHviaShapeShift', [props.depositType])),
        h('div', this.context.t('conversionProgress')),
        h('div', {
          style: {
            fontSize: 'x-small',
            color: '#ABA9AA',
            width: '100%',
          },
        }, formatDate(props.time)),
      ])

    case 'failed':
      return h('span.error', '(' + this.context.t('failed') + ')')
    default:
      return ''
  }
}
