/**
 * @file      The central metamask controller. Aggregates other controllers and exports an api.
 * @copyright Copyright (c) 2018 MetaMask
 * @license   MIT
 */

const EventEmitter = require('events')
const pump = require('pump')
const Dnode = require('dnode')
const ObservableStore = require('obs-store')
const ComposableObservableStore = require('./lib/ComposableObservableStore')
const asStream = require('obs-store/lib/asStream')
const AccountTracker = require('./lib/account-tracker')
const debounce = require('debounce')
const {setupMultiplex} = require('./lib/stream-utils.js')
const PreferencesController = require('./controllers/preferences')
const CachedBalancesController = require('./controllers/cached-balances')
const NoticeController = require('./notice-controller')
const MessageManager = require('./lib/message-manager')
const nodeify = require('./lib/nodeify')
const accountImporter = require('./account-import-strategies')
const {Mutex} = require('await-semaphore')
const {version} = require('../manifest.json')
const log = require('loglevel')
const JingtumWallet = require('jcc_jingtum_base_lib').Wallet
import JingchangWallet from 'jcc_wallet/lib/jingchangWallet'
import * as jtWallet from 'jcc_wallet/lib/jingtum'

module.exports = class MetamaskController extends EventEmitter {

  /**
   * @constructor
   * @param {Object} opts
   */
   constructor (opts) {
    super()
    // import { JcConfig } from 'jcc_rpc'

    this.sendUpdate = debounce(this.privateSendUpdate.bind(this), 200)
    this.opts = opts
    const initState = opts.initState || {}
    this.recordFirstTimeInfo(initState)

    // this keeps track of how many "controllerStream" connections are open
    // the only thing that uses controller connections are open metamask UI instances
    this.activeControllerConnections = 0

    // platform-specific api
    this.platform = opts.platform
    // observable state store
    this.store = new ComposableObservableStore(initState)

    // lock to ensure only one vault created at once
    this.createVaultMutex = new Mutex()

    // preferences controller
    this.preferencesController = new PreferencesController({
      initState: initState.PreferencesController,
      initLangCode: opts.initLangCode,
      openPopup: opts.openPopup,
    })

    this.accountTracker = new AccountTracker({
      initState: initState.AccountTracker,
    })

    // start and stop polling for balances based on activeControllerConnections
    this.on('controllerConnectionChanged', (activeControllerConnections) => {
      if (activeControllerConnections > 0) {
        this.accountTracker.start()
      } else {
        this.accountTracker.stop()
      }
    })

    this.cachedBalancesController = new CachedBalancesController({
      accountTracker: this.accountTracker,
      initState: initState.CachedBalancesController,
    })

    // notices
    this.noticeController = new NoticeController({
      initState: initState.NoticeController,
      version,
      firstVersion: initState.firstTimeInfo.version,
    })

    this.messageManager = new MessageManager()
    this.publicConfigStore = this.initPublicConfigStore()


    this.store.updateStructure({
      AccountTracker: this.accountTracker.store,
      PreferencesController: this.preferencesController.store,
      NoticeController: this.noticeController.store,
      CachedBalancesController: this.cachedBalancesController.store,
    })

    this.memStore = new ComposableObservableStore(null, {
      AccountTracker: this.accountTracker.store,
      MessageManager: this.messageManager.memStore,
      PreferencesController: this.preferencesController.store,
      NoticeController: this.noticeController.memStore,
      CachedBalancesController: this.cachedBalancesController.store,
    })
    this.memStore.subscribe(this.sendUpdate.bind(this))
  }


  /**
   * Constructor helper: initialize a public config store.
   * This store is used to make some config info available to Dapps synchronously.
   */
  initPublicConfigStore () {
    // get init state
    const publicConfigStore = new ObservableStore()

    // memStore -> transform -> publicConfigStore
    this.on('update', (memState) => {
      this.isClientOpenAndUnlocked = memState.isUnlocked && this._isClientOpen
      const publicState = selectPublicState(memState)
      publicConfigStore.putState(publicState)
    })

    function selectPublicState (memState) {
      const result = {
        selectedAddress: memState.isUnlocked ? memState.selectedAddress : undefined,
      }
      return result
    }

    return publicConfigStore
  }

//=============================================================================
// EXPOSED TO THE UI SUBSYSTEM
//=============================================================================

  /**
   * The metamask-state of the various controllers, made available to the UI
   *
   * @returns {Object} status
   */
  getState () {
    const wallet = JingchangWallet.get()
    const isInitialized = !!wallet
    return {
      ...{ isInitialized },
      ...this.memStore.getFlatState(),
      ...{
        // TODO: Remove usages of lost accounts
        lostAccounts: [],
      },
    }
  }

  /**
   * Returns an Object containing API Callback Functions.
   * These functions are the interface for the UI.
   * The API object can be transmitted over a stream with dnode.
   *
   * @returns {Object} Object containing API functions.
   */
  getApi () {
    const preferencesController = this.preferencesController
    const noticeController = this.noticeController

    return {
      // etc
      getState: (cb) => cb(null, this.getState()),
      setFirstTimeFlowType: this.setFirstTimeFlowType.bind(this),
      setCurrentLocale: this.setCurrentLocale.bind(this),
      markAccountsFound: this.markAccountsFound.bind(this),
      markPasswordForgotten: this.markPasswordForgotten.bind(this),
      unMarkPasswordForgotten: this.unMarkPasswordForgotten.bind(this),


      // primary HD keyring management
      addNewAccount: nodeify(this.addNewAccount, this),
      placeSeedWords: this.placeSeedWords.bind(this),
      verifySeedPhrase: nodeify(this.verifySeedPhrase, this),
      clearSeedWordCache: this.clearSeedWordCache.bind(this),
      resetAccount: nodeify(this.resetAccount, this),
      removeAccount: nodeify(this.removeAccount, this),
      importAccountWithStrategy: nodeify(this.importAccountWithStrategy, this),

      createNewVaultAndKeychain: nodeify(this.createNewVaultAndKeychain, this),
      createNewVaultAndRestore: nodeify(this.createNewVaultAndRestore, this),

      // mobile
      fetchInfoToSync: nodeify(this.fetchInfoToSync, this),

      // vault management
      submitPassword: nodeify(this.submitPassword, this),

      // PreferencesController
      setSelectedAddress: nodeify(preferencesController.setSelectedAddress, preferencesController),
      setCurrentAccountTab: nodeify(preferencesController.setCurrentAccountTab, preferencesController),
      setAccountLabel: nodeify(preferencesController.setAccountLabel, preferencesController),
      setFeatureFlag: nodeify(preferencesController.setFeatureFlag, preferencesController),
      setPreference: nodeify(preferencesController.setPreference, preferencesController),
      completeOnboarding: nodeify(preferencesController.completeOnboarding, preferencesController),
      addKnownMethodData: nodeify(preferencesController.addKnownMethodData, preferencesController),



      // notices
      checkNotices: noticeController.updateNoticesList.bind(noticeController),
      markNoticeRead: noticeController.markNoticeRead.bind(noticeController),

    }
  }


//=============================================================================
// VAULT / KEYRING RELATED METHODS
//=============================================================================

  /**
   * Creates a new Vault and create a new keychain.
   *
   * A vault, or KeyringController, is a controller that contains
   * many different account strategies, currently called Keyrings.
   * Creating it new means wiping all previous keyrings.
   *
   * A keychain, or keyring, controls many accounts with a single backup and signing strategy.
   * For example, a mnemonic phrase can generate many accounts, and is a keyring.
   *
   * @param  {string} password
   *
   * @returns {Object} vault
   */
  async createNewVaultAndKeychain (password) {
    const releaseLock = await this.createVaultMutex.acquire()
    try {

      const keypairs = await JingtumWallet.generate()
      if (!JingchangWallet.get()) {
        await JingchangWallet.generate(password, keypairs.secret).then((wallet) => {
       // inst.setJingchangWallet(wallet)
         JingchangWallet.save(wallet)
        })
      } else {
        const inst = JingchangWallet.get()
        const getSecret = jtWallet.getAddress
        await inst.importSecret(keypairs.secret, password, 'swt', getSecret)
      }
    const wallets = JingchangWallet.getWallets(JingchangWallet.get())
    this.preferencesController.setAddresses(wallets)
    const addrToAdd = []
    addrToAdd.push(keypairs.address)
    this.accountTracker.addAccounts(addrToAdd)
    this.selectFirstIdentity()
    releaseLock()
      return keypairs.secret
    } catch (err) {
      releaseLock()
      throw err
    }
  }

  /**
   * Create a new Vault and restore an existent keyring.
   * @param  {} password
   * @param  {} seed
   */
  async createNewVaultAndRestore (seed) {
    const keystore = JSON.parse(seed)
    const releaseLock = await this.createVaultMutex.acquire()
    try {
      let address
      const jccwallets = keystore.wallets[0]
      // clear known identities
      this.preferencesController.setAddresses([])
      // create new vault
      if (!JingchangWallet.get()) {
       // inst.setJingchangWallet(jccwallets)
        JingchangWallet.save(keystore)
        address = jccwallets.address
      } else {
        const inst = JingchangWallet.get()
        JingchangWallet.save(inst.wallets.put(jccwallets[0]))
        address = jccwallets.address
      }
      const wallets = JingchangWallet.getWallets(JingchangWallet.get())
      this.preferencesController.setAddresses(wallets)
      const addrToAdd = []
      addrToAdd.push(address)
      this.accountTracker.addAccounts(addrToAdd)
      this.selectFirstIdentity()
      releaseLock()
      return address
    } catch (err) {
      releaseLock()
      throw err
    }
  }

  /**
   * Get an account balance from the AccountTracker or request it directly from the network.
   * @param {string} address - The account address
   * @param {EthQuery} ethQuery - The EthQuery instance to use when asking the network
   */
  getBalance (address, ethQuery) {
    return new Promise((resolve, reject) => {
      const cached = this.accountTracker.store.getState().accounts[address]

      if (cached && cached.balance) {
        resolve(cached.balance)
      } else {
        ethQuery.getBalance(address, (error, balance) => {
          if (error) {
            reject(error)
            log.error(error)
          } else {
            resolve(balance || '0x0')
          }
        })
      }
    })
  }

  /**
   * Collects all the information that we want to share
   * with the mobile client for syncing purposes
   * @returns Promise<Object> Parts of the state that we want to syncx
   */
   async fetchInfoToSync () {
    // Preferences
    const {
      accountTokens,
      currentLocale,
      identities,
      selectedAddress,
      tokens,
    } = this.preferencesController.store.getState()

    const preferences = {
      accountTokens,
      currentLocale,
      identities,
      selectedAddress,
      tokens,
    }

    // Accounts

    const accounts = {
      simpleKeyPair: [],
    }


    return {
      accounts,
      preferences,
    }
  }


  /**
   * @type Identity
   * @property {string} name - The account nickname.
   * @property {string} address - The account's ethereum address, in lower case.
   * @property {boolean} mayBeFauceting - Whether this account is currently
   * receiving funds from our automatic Ropsten faucet.
   */

  /**
   * Sets the first address in the state to the selected address
   */
  selectFirstIdentity () {
    const { identities } = this.preferencesController.store.getState()
    const address = Object.keys(identities)[0]
    this.preferencesController.setSelectedAddress(address)
  }


  //
  // Account Management
  //

  /**
   * Adds a new account to the default (first) HD seed phrase Keyring.
   *
   * @returns {} keyState
   */
  async addNewAccount (password) {
    const keypairs = JingtumWallet.generate()
    JingchangWallet.generate(password, keypairs.secret).then((wallet) => {
      if (!JingchangWallet.get()) {
        JingchangWallet.save(wallet)
      } else {
        const inst = JingchangWallet.get()
        inst.wallets.push(wallet.wallets[0])
        JingchangWallet.save(inst)
      }
      const wallets = JingchangWallet.getWallets(JingchangWallet.get())
      this.preferencesController.setAddresses(wallets)
      const addrToAdd = []
      addrToAdd.push(keypairs.address)
      this.accountTracker.addAccounts(addrToAdd)
      this.preferencesController.setSelectedAddress(keypairs.address)
  })
  return keypairs.address
  }
  /**
   * Adds the current vault's seed words to the UI's state tree.
   *
   * Used when creating a first vault, to allow confirmation.
   * Also used when revealing the seed words in the confirmation view.
   *
   * @param {Function} cb - A callback called on completion.
   */
  placeSeedWords (cb) {
    this.verifySeedPhrase()
      .then((seedWords) => {
        this.preferencesController.setSeedWords(seedWords)
        return cb(null, seedWords)
      })
      .catch((err) => {
        return cb(err)
      })
  }

  /**
   * Verifies the validity of the current vault's seed phrase.
   *
   * Validity: seed phrase restores the accounts belonging to the current vault.
   *
   * Called when the first account is created and on unlocking the vault.
   *
   * @returns {Promise<string>} Seed phrase to be confirmed by the user.
   */
  async verifySeedPhrase () {


  }

  /**
   * Remove the primary account seed phrase from the UI's state tree.
   *
   * The seed phrase remains available in the background process.
   *
   * @param {function} cb Callback function called with the current address.
   */
  clearSeedWordCache (cb) {
    this.preferencesController.setSeedWords(null)
    cb(null, this.preferencesController.getSelectedAddress())
  }

  /**
   * Clears the transaction history, to allow users to force-reset their nonces.
   * Mostly used in development environments, when networks are restarted with
   * the same network ID.
   *
   * @returns Promise<string> The current selected address.
   */
  async resetAccount () {
    const selectedAddress = this.preferencesController.getSelectedAddress()

    return selectedAddress
  }

  /**
   * Removes an account from state / storage.
   *
   * @param {string[]} address A hex address
   *
   */
  async removeAccount (address) {
    // Remove account from the preferences controller
    this.preferencesController.removeAddress(address)

    return address
  }


  /**
   * Imports an account with the specified import strategy.
   * These are defined in app/scripts/account-import-strategies
   * Each strategy represents a different way of serializing an Jingtum key pair.
   *
   * @param  {string} strategy - A unique identifier for an account import strategy.
   * @param  {any} args - The data required by that strategy to import an account.
   * @param  {Function} cb - A callback function called with a state update on success.
   */
  async importAccountWithStrategy (strategy, args) {
    const address = await accountImporter.importAccount(strategy, args)
    const wallets = JingchangWallet.getWallets(JingchangWallet.get())
    this.preferencesController.setAddresses(wallets)
   // await this.preferencesController.setSelectedAddress(address)
    const addrToAdd = []
    addrToAdd.push(address)
    this.accountTracker.addAccounts(addrToAdd)
    //this.selectFirstIdentity()
    this.preferencesController.setSelectedAddress(address)
  }

  // ---------------------------------------------------------------------------
  // Identity Management (signature operations)



  // ---------------------------------------------------------------------------
  // MetaMask Version 3 Migration Account Restauration Methods

  /**
   * A legacy method (probably dead code) that was used when we swapped out our
   * key management library that we depended on.
   *
   * Described in:
   * https://medium.com/metamask/metamask-3-migration-guide-914b79533cdd
   *
   * @deprecated
   * @param  {} migratorOutput
   */
  restoreOldVaultAccounts (migratorOutput) {
    const { serialized } = migratorOutput
    return this.keyringController.restoreKeyring(serialized)
    .then(() => migratorOutput)
  }

  /**
   * A legacy method used to record user confirmation that they understand
   * that some of their accounts have been recovered but should be backed up.
   * This function no longer does anything and will be removed.
   *
   * @deprecated
   * @param {Function} cb - A callback function called with a full state update.
   */
  markAccountsFound (cb) {
    // TODO Remove me
    cb(null, this.getState())
  }

  /**
   * An account object
   * @typedef Account
   * @property string privateKey - The private key of the account.
   */


//=============================================================================
// END (VAULT / KEYRING RELATED METHODS)
//=============================================================================


//=============================================================================
// PASSWORD MANAGEMENT
//=============================================================================

  /**
   * Allows a user to begin the seed phrase recovery process.
   * @param {Function} cb - A callback function called when complete.
   */
  markPasswordForgotten (cb) {
    this.preferencesController.setPasswordForgotten(true)
    this.sendUpdate()
    cb()
  }

  /**
   * Allows a user to end the seed phrase recovery process.
   * @param {Function} cb - A callback function called when complete.
   */
  unMarkPasswordForgotten (cb) {
    this.preferencesController.setPasswordForgotten(false)
    this.sendUpdate()
    cb()
  }

//=============================================================================
// SETUP
//=============================================================================



  /**
   * Called when we detect a suspicious domain. Requests the browser redirects
   * to our anti-phishing page.
   *
   * @private
   * @param {*} connectionStream - The duplex stream to the per-page script,
   * for sending the reload attempt to.
   * @param {string} hostname - The URL that triggered the suspicion.
   */
  sendPhishingWarning (connectionStream, hostname) {
    const mux = setupMultiplex(connectionStream)
    const phishingStream = mux.createStream('phishing')
    phishingStream.write({ hostname })
  }

  /**
   * A method for providing our API over a stream using Dnode.
   * @param {*} outStream - The stream to provide our API over.
   */
  setupControllerConnection (outStream) {
    const api = this.getApi()
    const dnode = Dnode(api)
    // report new active controller connection
    this.activeControllerConnections++
    this.emit('controllerConnectionChanged', this.activeControllerConnections)
    // connect dnode api to remote connection
    pump(
      outStream,
      dnode,
      outStream,
      (err) => {
        // report new active controller connection
        this.activeControllerConnections--
        this.emit('controllerConnectionChanged', this.activeControllerConnections)
        // report any error
        if (err) log.error(err)
      }
    )
    dnode.on('remote', (remote) => {
      // push updates to popup
      const sendUpdate = (update) => remote.sendUpdate(update)
      this.on('update', sendUpdate)
      // remove update listener once the connection ends
      dnode.on('end', () => this.removeListener('update', sendUpdate))
    })
  }


  /**
   * A method for providing our public config info over a stream.
   * This includes info we like to be synchronous if possible, like
   * the current selected account, and network ID.
   *
   * Since synchronous methods have been deprecated in web3,
   * this is a good candidate for deprecation.
   *
   * @param {*} outStream - The stream to provide public config over.
   */
  setupPublicConfig (outStream) {
    const configStream = asStream(this.publicConfigStore)
    pump(
      configStream,
      outStream,
      (err) => {
        configStream.destroy()
        if (err) log.error(err)
      }
    )
  }


  /**
   * A method for emitting the full MetaMask state to all registered listeners.
   * @private
   */
  privateSendUpdate () {
    this.emit('update', this.getState())
  }


//=============================================================================
// CONFIG
//=============================================================================

  // Log blocks

  setMetaMetricsSendCount (val, cb) {
    try {
      this.preferencesController.setMetaMetricsSendCount(val)
      cb(null)
    } catch (err) {
      cb(err)
    }
  }

  /**
   * Sets the type of first time flow the user wishes to follow: create or import
   * @param {String} type - Indicates the type of first time flow the user wishes to follow
   * @param {Function} cb - A callback function called when complete.
   */
  setFirstTimeFlowType (type, cb) {
    try {
      this.preferencesController.setFirstTimeFlowType(type)
      cb(null)
    } catch (err) {
      cb(err)
    }
  }


  /**
   * A method for setting a user's current locale, affecting the language rendered.
   * @param {string} key - Locale identifier.
   * @param {Function} cb - A callback function called when complete.
   */
  setCurrentLocale (key, cb) {
    try {
      this.preferencesController.setCurrentLocale(key)
      cb(null)
    } catch (err) {
      cb(err)
    }
  }

  /**
   * A method for initializing storage the first time.
   * @param {Object} initState - The default state to initialize with.
   * @private
   */
  recordFirstTimeInfo (initState) {
    if (!('firstTimeInfo' in initState)) {
      initState.firstTimeInfo = {
        version,
        date: Date.now(),
      }
    }
  }

  // TODO: Replace isClientOpen methods with `controllerConnectionChanged` events.
  /**
   * A method for recording whether the MetaMask user interface is open or not.
   * @private
   * @param {boolean} open
   */
  set isClientOpen (open) {
    this._isClientOpen = open
  //  this.isClientOpenAndUnlocked = this.getState().isUnlocked && open
   // this.detectTokensController.isOpen = open
  }


  //set isClientOpenAndUnlocked (active) {
  //  this.tokenRatesController.isActive = active
 // }

 setupTrustedCommunication (connectionStream, originDomain) {
  // setup multiplexing
  const mux = setupMultiplex(connectionStream)
  // connect features
  this.setupControllerConnection(mux.createStream('controller'))
}
 /**
  * Creates RPC engine middleware for processing eth_signTypedData requests
  *
  * @param {Object} req - request object
  * @param {Object} res - response object
  * @param {Function} - next
  * @param {Function} - end
  */

  /**
   * Adds a domain to the {@link BlacklistController} whitelist
   * @param {string} hostname the domain to whitelist
   */
  whitelistPhishingDomain (hostname) {
    return this.blacklistController.whitelistDomain(hostname)
  }

  /**
   * Locks MetaMask
   */
  setLocked () {
    this.providerApprovalController.setLocked()
    return this.keyringController.setLocked()
  }
}
