const {EventEmitter} = require('events')
const async = require('async')
const Dnode = require('dnode')
const launchMetamaskUi = require('../../ui')
const {setupMultiplex} = require('./lib/stream-utils.js')

module.exports = initializePopup

/**
 * Asynchronously initializes the MetaMask popup UI
 *
 * @param {{ container: Element, connectionStream: * }} config Popup configuration object
 * @param {Function} cb Called when initialization is complete
 */
function initializePopup ({ container, connectionStream }, cb) {
  // setup app
  async.waterfall([
   (cb) => connectToAccountManager(connectionStream, cb),
   (accountManager, cb) => launchMetamaskUi({ container, accountManager }, cb),
  ], cb)
}

/**
 * Establishes streamed connections to background scripts and a Web3 provider
 *
 * @param {PortDuplexStream} connectionStream PortStream instance establishing a background connection
 * @param {Function} cb Called when controller connection is established
 */
function connectToAccountManager (connectionStream, cb) {
  // setup communication with background
  // setup multiplexing
  try {
    const mx = setupMultiplex(connectionStream)
    // connect features
    setupControllerConnection(mx.createStream('controller'), cb)
   // setupWeb3Connection(mx.createStream('provider'))
  } catch (err) {
     console.error('connectToAccountManager' + err)
  }
}


/**
 * Establishes a streamed connection to the background account manager
 *
 * @param {PortDuplexStream} connectionStream PortStream instance establishing a background connection
 * @param {Function} cb Called when the remote account manager connection is established
 */
function setupControllerConnection (connectionStream, cb) {
  // this is a really sneaky way of adding EventEmitter api
  // to a bi-directional dnode instance
  const eventEmitter = new EventEmitter()
  const accountManagerDnode = Dnode({
    sendUpdate: function (state) {
      eventEmitter.emit('update', state)
    },
  })
  connectionStream.pipe(accountManagerDnode).pipe(connectionStream)
  accountManagerDnode.once('remote', function (accountManager) {
    // setup push events
    accountManager.on = eventEmitter.on.bind(eventEmitter)
    cb(null, accountManager)
  })

  connectionStream.on('error', console.error.bind(console))
}
