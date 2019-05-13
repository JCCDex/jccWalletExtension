const render = require('react-dom').render
const h = require('react-hyperscript')
const Root = require('./app/root')
const actions = require('./app/actions')
const configureStore = require('./app/store')
const { fetchLocale } = require('./i18n-helper')
const log = require('loglevel')

module.exports = launchMetamaskUi

log.setLevel(global.METAMASK_DEBUG ? 'debug' : 'warn')

function launchMetamaskUi (opts, cb) {
  var accountManager = opts.accountManager
  actions._setBackgroundConnection(accountManager)
  // check if we are unlocked first
  accountManager.getState(function (err, metamaskState) {
    if (err) return cb(err)
    startApp(metamaskState, accountManager, opts)
      .then((store) => {
        cb(null, store)
      })
  })
}

async function startApp (metamaskState, accountManager, opts) {
  // parse opts
  if (!metamaskState.featureFlags) metamaskState.featureFlags = {}

  const currentLocaleMessages = metamaskState.currentLocale
    ? await fetchLocale(metamaskState.currentLocale)
    : {}
  const enLocaleMessages = await fetchLocale('en')
  const store = configureStore({

    // metamaskState represents the cross-tab state
    metamask: metamaskState,

    // appState represents the current tab's popup state
    appState: {},

    localeMessages: {
      current: currentLocaleMessages,
      en: enLocaleMessages,
    },

  })
  accountManager.on('update', function (metamaskState) {
    store.dispatch(actions.updateMetamaskState(metamaskState))
  })

  // global metamask api - used by tooling
  global.metamask = {
    updateCurrentLocale: (code) => {
      store.dispatch(actions.updateCurrentLocale(code))
    },
    setProviderType: (type) => {
      store.dispatch(actions.setProviderType(type))
    },
  }
  
  // start app
  render(
    h(Root, {
      // inject initial state
      store: store,
    }
  ), opts.container)

  return store
}
