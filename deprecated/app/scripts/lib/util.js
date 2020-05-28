const assert = require('assert')
const {
  ENVIRONMENT_TYPE_POPUP,
  ENVIRONMENT_TYPE_NOTIFICATION,
  ENVIRONMENT_TYPE_FULLSCREEN,
  PLATFORM_FIREFOX,
  PLATFORM_OPERA,
  PLATFORM_CHROME,
  PLATFORM_EDGE,
  PLATFORM_BRAVE,
} = require('./enums')

/**
 * Generates an example stack trace
 *
 * @returns {string} A stack trace
 *
 */
function getStack () {
  const stack = new Error('Stack trace generator - not an error').stack
  return stack
}

/**
 * Used to determine the window type through which the app is being viewed.
 *  - 'popup' refers to the extension opened through the browser app icon (in top right corner in chrome and firefox)
 *  - 'responsive' refers to the main browser window
 *  - 'notification' refers to the popup that appears in its own window when taking action outside of metamask
 *
 * @returns {string} A single word label that represents the type of window through which the app is being viewed
 *
 */
const getEnvironmentType = (url = window.location.href) => {
  if (url.match(/popup.html(?:#.*)*$/)) {
    return ENVIRONMENT_TYPE_POPUP
  } else if (url.match(/home.html(?:\?.+)*$/) || url.match(/home.html(?:#.*)*$/)) {
    return ENVIRONMENT_TYPE_FULLSCREEN
  } else {
    return ENVIRONMENT_TYPE_NOTIFICATION
  }
}

/**
 * Returns the platform (browser) where the extension is running.
 *
 * @returns {string} the platform ENUM
 *
 */
const getPlatform = _ => {
  const ua = navigator.userAgent
  if (ua.search('Firefox') !== -1) {
    return PLATFORM_FIREFOX
  } else {
    if (window && window.chrome && window.chrome.ipcRenderer) {
      return PLATFORM_BRAVE
    } else if (ua.search('Edge') !== -1) {
      return PLATFORM_EDGE
    } else if (ua.search('OPR') !== -1) {
      return PLATFORM_OPERA
    } else {
      return PLATFORM_CHROME
    }
  }
}


function applyListeners (listeners, emitter) {
  Object.keys(listeners).forEach((key) => {
    emitter.on(key, listeners[key])
  })
}

function removeListeners (listeners, emitter) {
  Object.keys(listeners).forEach((key) => {
    emitter.removeListener(key, listeners[key])
  })
}

module.exports = {
  removeListeners,
  applyListeners,
  getPlatform,
  getStack,
  getEnvironmentType,

}
