const Component = require('react').Component
const PropTypes = require('prop-types')
const h = require('react-hyperscript')
const TokenCell = require('./token-cell.js')
const inherits = require('util').inherits
const connect = require('react-redux').connect
const selectors = require('../selectors')
const log = require('loglevel')
const Jccutils = require('../components/send/jccutils')

function mapStateToProps (state) {
  return {
    //tokens: state.metamask.tokens,
    accountsTokenBal: selectors.getSelectedAddressTokens(state),
    userAddress: selectors.getSelectedAddress(state),
    assetImages: state.metamask.assetImages,
  }
}


TokenList.contextTypes = {
  t: PropTypes.func,
}

module.exports = connect(mapStateToProps)(TokenList)


inherits(TokenList, Component)
function TokenList () {
  this.state = {
    tokens: [],
    isLoading: true,
    network: null,
  }
  Component.call(this)
}

TokenList.prototype.render = function () {
  const { accountsTokenBal } = this.props
  const state = this.state
  const { error } = state
  //if (isLoading) {
  //  return this.message(this.context.t('loadingTokens'))
 // }

  if (error) {
    log.error(error)
    return h('.hotFix', {
      style: {
        padding: '80px',
      },
    }, [
      this.context.t('troubleTokenBalances'),
      h('span.hotFix', {
        style: {
          color: 'rgba(247, 134, 28, 1)',
          cursor: 'pointer',
        },
      }, this.context.t('here')),
    ])
  }
  return h('div', accountsTokenBal.map((tokenData) => {
    //tokenData.image = assetImages[tokenData.address]
    return h(TokenCell, tokenData)
  }))

}

TokenList.prototype.message = function (body) {
  return h('div', {
    style: {
      display: 'flex',
      height: '250px',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '30px',
    },
  }, body)
}

TokenList.prototype.componentDidMount = function () {
  //this.createFreshTokenTracker()
}


TokenList.prototype.componentWillMount = function () {
  const jccutils = new Jccutils()
  const { userAddress } = this.props
  let tokensbal = []
   jccutils.getBalance(userAddress).then(bal => {
    if (bal) {
      bal.forEach(data => {
        if (data.currency !== 'SWT') {
          tokensbal.push({symbol: data.currency, string: data.value})
        }
      })
    }
  })
  this.setState({ tokens: tokensbal })
}

TokenList.prototype.componentDidUpdate = function (prevProps) {
  const {
    userAddress: oldAddress,
  } = prevProps
  const {
    userAddress: newAddress,
  } = this.props
  if (oldAddress !== newAddress) {
    const jccutils = new Jccutils()
    let tokensbal = []
    jccutils.getBalance(newAddress).then(bal => {
     if (bal) {
       bal.forEach(data => {
         if (data.currency !== 'SWT') {
           tokensbal.push({symbol: data.currency, string: data.value})
         }
       })
     }
   })
   this.setState({ tokens: tokensbal })
  }
}
