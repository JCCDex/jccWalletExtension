const injectCss = require('inject-css')
const NewMetaMaskUiCss = require('../../ui/css')
const startPopup = require('./popup-core')
const PortStream = require('extension-port-stream')
const { getEnvironmentType } = require('./lib/util')
const { ENVIRONMENT_TYPE_NOTIFICATION, ENVIRONMENT_TYPE_FULLSCREEN } = require('./lib/enums')
const extension = require('extensionizer')
const ExtensionPlatform = require('./platforms/extension')
const NotificationManager = require('./lib/notification-manager')
const notificationManager = new NotificationManager()
const log = require('loglevel')

start().catch(log.error)

async function start () {

  // create platform global
  global.platform = new ExtensionPlatform()

  // provide app state to append to error logs
  function getState () {
    // get app state
    const state = window.getCleanAppState()
    // remove unnecessary data
    delete state.localeMessages
    delete state.metamask.recentBlocks
    // return state to be added to request
    return state
  }

  // identify window type (popup, notification)
  const windowType = getEnvironmentType(window.location.href)
  global.METAMASK_UI_TYPE = windowType
  closePopupIfOpen(windowType)

  // setup stream to background
  const extensionPort = extension.runtime.connect({ name: windowType })
  const connectionStream = new PortStream(extensionPort)

  // start ui
  const container = document.getElementById('app-content')
  startPopup({ container, connectionStream }, (err, store) => {
    if (err) return displayCriticalError(err)

    const state = store.getState()
    const { metamask: { completedOnboarding } = {} } = state

    //如果未初始化，且为非全屏模式，则重新打开初始化页面。初始化页面为全屏
    //将初始化账户流程 更改为 在弹窗中进行。
    if (!completedOnboarding && windowType !== ENVIRONMENT_TYPE_FULLSCREEN) {
      //global.platform.openExtensionInBrowser()
      //return
    }

    injectCss(NewMetaMaskUiCss())
  })


  function closePopupIfOpen (windowType) {
    if (windowType !== ENVIRONMENT_TYPE_NOTIFICATION) {
      // should close only chrome popup
      notificationManager.closePopup()
    }
  }

  function displayCriticalError (err) {
    container.innerHTML = '<div class="critical-error">The MetaMask app failed to load: please open and close MetaMask again to restart.</div>'
    container.style.height = '80px'
    log.error(err.stack)
    throw err
  }

}
