
cleanContextForImports()
const log = require('loglevel')
const LocalMessageDuplexStream = require('post-message-stream')
const MetaMaskInpageProvider = require('metamask-inpage-provider')

let isEnabled = false
let warned = false
let providerHandle
let isUnlockedHandle

restoreContextAfterImports()

log.setDefaultLevel(process.env.JingtumMask_DEBUG ? 'debug' : 'warn')

/**
 * Adds a postMessage listener for a specific message type
 *
 * @param {string} messageType - postMessage type to listen for
 * @param {Function} handler - event handler
 * @param {boolean} remove - removes this handler after being triggered
 */
function onMessage (messageType, callback, remove) {
  const handler = function ({ data }) {
    if (!data || data.type !== messageType) { return }
    remove && window.removeEventListener('message', handler)
    callback.apply(window, arguments)
  }
  window.addEventListener('message', handler)
}

//
// setup plugin communication
//

// setup background connection
const JingtumMaskStream = new LocalMessageDuplexStream({
  name: 'inpage',
  target: 'contentscript',
})

// compose the inpage provider
const inpageProvider = new MetaMaskInpageProvider(JingtumMaskStream)

// set a high max listener count to avoid unnecesary warnings
inpageProvider.setMaxListeners(100)

// set up a listener for when JingtumMask is locked
onMessage('JingtumMasksetlocked', () => { isEnabled = false })


// augment the provider with its enable method
inpageProvider.enable = function ({ force } = {}) {
  return new Promise((resolve, reject) => {
    providerHandle = ({ data: { error, selectedAddress } }) => {
      if (typeof error !== 'undefined') {
        reject({
          message: error,
          code: 4001,
        })
      } else {
        window.removeEventListener('message', providerHandle)
        setTimeout(() => {
          inpageProvider.publicConfigStore.updateState({ selectedAddress })
        }, 0)
      }
    }
  })
}

// add JingtumMask-specific convenience methods
inpageProvider._JingtumMask = new Proxy({
  /**
   * Determines if this domain is currently enabled
   *
   * @returns {boolean} - true if this domain is currently enabled
   */
  isEnabled: function () {
    return isEnabled
  },


  /**
   * Determines if JingtumMask is unlocked by the user
   *
   * @returns {Promise<boolean>} - Promise resolving to true if JingtumMask is currently unlocked
   */
  isUnlocked: function () {
    return new Promise((resolve) => {
      isUnlockedHandle = ({ data: { isUnlocked } }) => {
        resolve(!!isUnlocked)
      }
      onMessage('JingtumMaskisunlocked', isUnlockedHandle, true)
      window.postMessage({ type: 'JingtumMask_IS_UNLOCKED' }, '*')
    })
  },
}, {
  get: function (obj, prop) {
    !warned && console.warn('Heads up! SWTC._JingtumMask exposes methods that have ' +
    'not been standardized yet. This means that these methods may not be implemented ' +
    'in other dapp browsers and may be removed from JingtumMask in the future.')
    warned = true
    return obj[prop]
  },
})

// need to make sure we aren't affected by overlapping namespaces
// and that we dont affect the app with our namespace
// mostly a fix for web3's BigNumber if AMD's "define" is defined...
let __define

/**
 * Caches reference to global define object and deletes it to
 * avoid conflicts with other global define objects, such as
 * AMD's define function
 */
function cleanContextForImports () {
  __define = global.define
  try {
    global.define = undefined
  } catch (_) {
    console.warn('JingtumMask - global.define could not be deleted.')
  }
}

/**
 * Restores global define object from cached reference
 */
function restoreContextAfterImports () {
  try {
    global.define = __define
  } catch (_) {
    console.warn('JingtumMask - global.define could not be overwritten.')
  }
}
