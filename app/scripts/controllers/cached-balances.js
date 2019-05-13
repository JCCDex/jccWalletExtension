const ObservableStore = require('obs-store')
const extend = require('xtend')

/**
 * @typedef {Object} CachedBalancesOptions
 * @property {Object} accountTracker An {@code AccountTracker} reference
 * @property {Function} getNetwork A function to get the current network
 * @property {Object} initState The initial controller state
 */

/**
 * Background controller responsible for maintaining
 * a cache of account balances in local storage
 */
class CachedBalancesController {
  /**
   * Creates a new controller instance
   *
   * @param {CachedBalancesOptions} [opts] Controller configuration parameters
   */
  constructor (opts = {}) {
    const { accountTracker } = opts

    this.accountTracker = accountTracker

    const initState = extend({
      cachedBalances: {},
    }, opts.initState)
    this.store = new ObservableStore(initState)

    this._registerUpdates()
  }

  /**
   * Updates the cachedBalances property for the current network. Cached balances will be updated to those in the passed accounts
   * if balances in the passed accounts are truthy.
   *
   * @param {Object} obj The the recently updated accounts object for the current network
   * @returns {Promise<void>}
   */
  async updateCachedBalances ({ accounts }) {
    const balancesToCache = await this._generateBalancesToCache(accounts)
    this.store.updateState({
      cachedBalances: balancesToCache,
    })
  }

  _generateBalancesToCache (newAccounts) {
    const { cachedBalances } = this.store.getState()
    const currentNetworkBalancesToCache = { ...cachedBalances }

    Object.keys(newAccounts).forEach(accountID => {
      const account = newAccounts[accountID]

      if (account.balance) {
        currentNetworkBalancesToCache[accountID] = account.balance
      }
    })
    const balancesToCache = {
      ...cachedBalances,
      currentNetworkBalancesToCache,
    }

    return balancesToCache
  }

  /**
   * Sets up listeners and subscriptions which should trigger an update of cached balances. These updates will
   * happen when the current account changes. Which happens on block updates, as well as on network and account
   * selections.
   *
   * @private
   *
   */
  _registerUpdates () {
    const update = this.updateCachedBalances.bind(this)
    this.accountTracker.store.subscribe(update)
  }
}

module.exports = CachedBalancesController
