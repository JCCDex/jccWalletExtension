/* Account Tracker
 *
 * This module is responsible for tracking any number of accounts
 * and caching their current balances & transaction counts.
 *
 * It also tracks transaction hashes, and checks their inclusion status
 * on each new block.
 */


const ObservableStore = require('obs-store')
const extend = require('xtend')
const Jccutils = require('../../../ui/app/components/send/jccutils')

class AccountTracker {

  /**
   * This module is responsible for tracking any number of accounts and caching their current balances & transaction
   * counts.
   *
   * It also tracks transaction hashes, and checks their inclusion status on each new block.
   *
   * @typedef {Object} AccountTracker
   * @param {Object} opts Initialize various properties of the class.
   * @property {Object} store The stored object containing all accounts to track, as well as the current block's gas limit.
   * @property {Object} store.accounts The accounts currently stored in this AccountTracker
   * @property {string} store.currentBlockGasLimit A hex string indicating the gas limit of the current block
   * @property {Object} _provider A provider needed to create the EthQuery instance used within this AccountTracker.
   * @property {EthQuery} _query An EthQuery instance used to access account information from the blockchain
   * @property {BlockTracker} _blockTracker A BlockTracker instance. Needed to ensure that accounts and their info updates
   * when a new block is created.
   * @property {Object} _currentBlockNumber Reference to a property on the _blockTracker: the number (i.e. an id) of the the current block
   *
   */
  constructor (opts = {}) {
    const initState = extend({
      accounts: {},
      accountsTokenBal: {},
      accountsAllTokenBal: {},
      currentBlockGasLimit: '',
    }, opts.initState)
   // const initState = {
    //  accounts: {},
    //  currentBlockGasLimit: '',
   // }
    this.store = new ObservableStore(initState)
    // const accountOrder = keyrings.reduce((list, keyring) => list.concat(keyring.accounts), [])

  }

  start () {

    // fetch account balances
    this._updateAccounts()
  }

  stop () {
  }

  /**
   * Ensures that the locally stored accounts are in sync with a set of accounts stored externally to this
   * AccountTracker.
   *
   * Once this AccountTracker's accounts are up to date with those referenced by the passed addresses, each
   * of these accounts are given an updated balance via EthQuery.
   *
   * @param {array} address The array of hex addresses for accounts with which this AccountTracker's accounts should be
   * in sync
   *
   */
  syncWithAddresses (addresses) {
    const accounts = this.store.getState().accounts
    const locals = Object.keys(accounts)

    const accountsToAdd = []
    addresses.forEach((upstream) => {
      if (!locals.includes(upstream)) {
        accountsToAdd.push(upstream)
      }
    })

    const accountsToRemove = []
    locals.forEach((local) => {
      if (!addresses.includes(local)) {
        accountsToRemove.push(local)
      }
    })

    this.addAccounts(accountsToAdd)
    this.removeAccount(accountsToRemove)
  }

  /**
   * Adds new addresses to track the balances of
   * given a balance as long this._currentBlockNumber is defined.
   *
   * @param {array} addresses An array of hex addresses of new accounts to track
   *
   */
  addAccounts (addresses) {
    const accounts = this.store.getState().accounts
    // add initial state for addresses
    addresses.forEach(address => {
      accounts[address] = {}
    })
    // save accounts state
    this.store.updateState({ accounts })
    // fetch balances for the accounts if there is block number ready
    //if (!this._currentBlockNumber) return
    this._updateAccounts()
  }

  /**
   * Removes accounts from being tracked
   *
   * @param {array} an array of hex addresses to stop tracking
   *
   */
  removeAccount (addresses) {
    const accounts = this.store.getState().accounts
    // remove each state object
    addresses.forEach(address => {
      delete accounts[address]
    })
    // save accounts state
    this.store.updateState({ accounts })
  }



  /**
   * balanceChecker is deployed on main eth (test)nets and requires a single call
   * for all other networks, calls this._updateAccount for each account in this.store
   *
   * @returns {Promise} after all account balances updated
   *
   */
  async _updateAccounts () {
    const accounts = this.store.getState().accounts
    const addresses = Object.keys(accounts)
    this._updateAccountsViaBalanceChecker(addresses)
    //await Promise.all(addresses.map(this._updateAccount.bind(this)))
  }

  /**
   * Updates the current balance of an account.
   *
   * @private
   * @param {string} address A hex address of a the account to be updated
   * @returns {Promise} after the account balance is updated
   *
   */
  async _updateAccount (address) {
    // query balance
    const balance = await this.getJccRpc(address)
    const result = { address, balance }
    // update accounts state
    const { accounts } = this.store.getState()
    // only populate if the entry is still present
    if (!accounts[address]) return
    accounts[address] = result
    this.store.updateState({ accounts })
  }

    /**
   * Updates current address balances from balanceChecker deployed contract instance
   * @param {*} addresses
   * @param {*} deployedContractAddress
   */
  async _updateAccountsViaBalanceChecker (addresses) {
    const jccutils = new Jccutils()
    const accounts = this.store.getState().accounts
    const accountsTokenBal = this.store.getState().accountsTokenBal
    const accountsAllTokenBal = this.store.getState().accountsAllTokenBal
      addresses.forEach(async (address, index) => {
        const balArray = await jccutils.getBalance(address)
        console.log('balArray:')
        console.dir(balArray)
        //if (!accountsTokenBal[address]) {
          accountsTokenBal[address] = []
          accountsAllTokenBal[address] = []
      //  }
      if (balArray.length > 0) {
        balArray.map((balObj) => {
          let bal = Number(balObj.value).toFixed(4)
          let freezed = Number(balObj.freezed).toFixed(4)
          if(freezed > 0) {
            bal = bal + ' freezed:' + freezed
          }
          if (balObj.currency === 'SWT') {
            const balance = bal
            accounts[address] = { address, balance }
          } else {
            let cur = balObj.currency
            if(cur == 'CNY'){
              cur = 'CNT'
            }
            const val = bal
            accountsTokenBal[address].push({ cur, val })
          }
          accountsAllTokenBal[address].push([balObj.currency,bal])
        })
      } else {
        const balance = 0
        accounts[address] = { address, balance }
      }
      })
      this.store.updateState({ accounts })
      this.store.updateState({ accountsTokenBal })
      this.store.updateState({ accountsAllTokenBal })
  }

}

module.exports = AccountTracker
