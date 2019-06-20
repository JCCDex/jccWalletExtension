const ObservableStore = require('obs-store')
const extend = require('xtend')


class PreferencesController {

  /**
   *
   * @typedef {Object} PreferencesController
   * @param {object} opts Overrides the defaults for the initial state of this.store
   * @property {object} store The stored object containing a users preferences, stored in local storage
	 * @property {array} store.frequentRpcList A list of custom rpcs to provide the user
   * @property {string} store.currentAccountTab Indicates the selected tab in the ui
   * @property {array} store.tokens The tokens the user wants display in their token lists
   * @property {object} store.accountTokens The tokens stored per account and then per network type
   * @property {object} store.assetImages Contains assets objects related to assets added
   * @property {object} store.featureFlags A key-boolean map, where keys refer to features and booleans to whether the
   * user wishes to see that feature.
   *
   * Feature flags can be set by the global function `setPreference(feature, enabled)`, and so should not expose any sensitive behavior.
   * @property {object} store.knownMethodData Contains all data methods known by the user
   * @property {string} store.currentLocale The preferred language locale key
   * @property {string} store.selectedAddress A hex string that matches the currently selected address in the app
   *
   */
  constructor (opts = {}) {
    const initState = extend({
      frequentRpcListDetail: [],
      currentAccountTab: 'history',
      accountTokens: {},
      assetImages: {},
      tokens: [],
      suggestedTokens: {},

      // WARNING: Do not use feature flags for security-sensitive things.
      // Feature flag toggling is available in the global namespace
      // for convenient testing of pre-release features, and should never
      // perform sensitive operations.
      featureFlags: {},
      knownMethodData: {},
      participateInMetaMetrics: null,
      firstTimeFlowType: null,
      currentLocale: opts.initLangCode,
      identities: {},
      lostIdentities: {},
      seedWords: null,
      forgottenPassword: false,
      preferences: {
        useNativeCurrencyAsPrimaryCurrency: true,
      },
      completedOnboarding: false,
      completedUiMigration: true,
      metaMetricsId: null,
      metaMetricsSendCount: 0,
    }, opts.initState)

    this.diagnostics = opts.diagnostics
    this.store = new ObservableStore(initState)
    this.openPopup = opts.openPopup

    global.setPreference = (key, value) => {
      return this.setFeatureFlag(key, value)
    }
  }
// PUBLIC METHODS

  /**
   * Sets the {@code forgottenPassword} state property
   * @param {boolean} forgottenPassword whether or not the user has forgotten their password
   */
  setPasswordForgotten (forgottenPassword) {
    this.store.updateState({ forgottenPassword })
  }

  /**
   * Sets the {@code seedWords} seed words
   * @param {string|null} seedWords the seed words
   */
  setSeedWords (seedWords) {
    this.store.updateState({ seedWords })
  }

  /**
   * Setter for the `useBlockie` property
   *
   * @param {boolean} val Whether or not the user prefers blockie indicators
   *
   */
  setUseBlockie (val) {
    this.store.updateState({ useBlockie: val })
  }

  setMetaMetricsSendCount (val) {
    this.store.updateState({ metaMetricsSendCount: val })
  }

  getMetaMetricsSendCount () {
    return this.store.getState().metaMetricsSendCount
  }

  /**
   * Setter for the `firstTimeFlowType` property
   *
   * @param {String} type Indicates the type of first time flow - create or import - the user wishes to follow
   *
   */
   setFirstTimeFlowType (type) {
     this.store.updateState({ firstTimeFlowType: type })
   }


  getSuggestedTokens () {
    return this.store.getState().suggestedTokens
  }

  getAssetImages () {
    return this.store.getState().assetImages
  }


  /**
   * Add new methodData to state, to avoid requesting this information again through Infura
   *
   * @param {string} fourBytePrefix Four-byte method signature
   * @param {string} methodData Corresponding data method
   */
  addKnownMethodData (fourBytePrefix, methodData) {
    const knownMethodData = this.store.getState().knownMethodData
    knownMethodData[fourBytePrefix] = methodData
    this.store.updateState({ knownMethodData })
  }


  /**
   * Setter for the `currentLocale` property
   *
   * @param {string} key he preferred language locale key
   *
   */
  setCurrentLocale (key) {
    this.store.updateState({ currentLocale: key })
  }

  /**
   * Updates identities to only include specified addresses. Removes identities
   * not included in addresses array
   *
   * @param {string[]} addresses An array of hex addresses
   *
   */
  setAddresses (wallets) {
    const oldIdentities = this.store.getState().identities
    const identities = wallets.reduce((ids, wallet, index) => {
      const oldId = oldIdentities[wallet.address] || {}
      const address = wallet.address
      ids[wallet.address] = {name: `Account ${index}`, address, ...oldId}
      return ids
    }, {})
    this.store.updateState({ identities })
  }

  /**
   * Removes an address from state
   *
   * @param {string} address A hex address
   * @returns {string} the address that was removed
   */
  removeAddress (address) {
    const identities = this.store.getState().identities
    const accountTokens = this.store.getState().accountTokens
    if (!identities[address]) {
      throw new Error(`${address} can't be deleted cause it was not found`)
    }
    delete identities[address]
    delete accountTokens[address]
    this.store.updateState({ identities, accountTokens })

    // If the selected account is no longer valid,
    // select an arbitrary other account:
    if (address === this.getSelectedAddress()) {
      const selected = Object.keys(identities)[0]
      this.setSelectedAddress(selected)
    }
    return address
  }


  /**
   * Adds addresses to the identities object without removing identities
   *
   * @param {string[]} addresses An array of hex addresses
   *
   */
  addAddresses (addresses) {
    const identities = this.store.getState().identities
    const accountTokens = this.store.getState().accountTokens
    addresses.forEach((address) => {
      // skip if already exists
      if (identities[address]) return
      // add missing identity
      const identityCount = Object.keys(identities).length

      accountTokens[address] = {}
      identities[address] = { name: `Account ${identityCount + 1}`, address }
    })
    this.store.updateState({ identities, accountTokens })
  }

  /*
   * Synchronizes identity entries with known accounts.
   * Removes any unknown identities, and returns the resulting selected address.
   *
   * @param {Array<string>} addresses known to the vault.
   * @returns {Promise<string>} selectedAddress the selected address.
   */
  syncAddresses (addresses) {
    const { identities, lostIdentities } = this.store.getState()

    const newlyLost = {}
    Object.keys(identities).forEach((identity) => {
      if (!addresses.includes(identity)) {
        newlyLost[identity] = identities[identity]
        delete identities[identity]
      }
    })

    // Identities are no longer present.
    if (Object.keys(newlyLost).length > 0) {

      // Notify our servers:
      if (this.diagnostics) this.diagnostics.reportOrphans(newlyLost)

      // store lost accounts
      for (const key in newlyLost) {
        lostIdentities[key] = newlyLost[key]
      }
    }

    this.store.updateState({ identities, lostIdentities })
    this.addAddresses(addresses)

    // If the selected account is no longer valid,
    // select an arbitrary other account:
    let selected = this.getSelectedAddress()
    if (!addresses.includes(selected)) {
      selected = addresses[0]
      this.setSelectedAddress(selected)
    }

    return selected
  }


  /**
   * Setter for the `selectedAddress` property
   *
   * @param {string} _address A new hex address for an account
   * @returns {Promise<void>} Promise resolves with tokens
   *
   */
  setSelectedAddress (address) {
    this._updateTokens(address)
    this.store.updateState({ selectedAddress: address })
    const tokens = this.store.getState().tokens
    return Promise.resolve(tokens)
  }

  /**
   * Getter for the `selectedAddress` property
   *
   * @returns {string} The hex address for the currently selected account
   *
   */
  getSelectedAddress () {
    return this.store.getState().selectedAddress
  }

  /**
   * A getter for the `tokens` property
   *
   * @returns {array} The current array of AddedToken objects
   *
   */
  getTokens () {
    return this.store.getState().tokens
  }

  /**
   * Sets a custom label for an account
   * @param {string} account the account to set a label for
   * @param {string} label the custom label for the account
   * @return {Promise<string>}
   */
  setAccountLabel (account, label) {
    if (!account) throw new Error('setAccountLabel requires a valid address, got ' + String(account))
    const address = normalizeAddress(account)
    const {identities} = this.store.getState()
    identities[address] = identities[address] || {}
    identities[address].name = label
    this.store.updateState({ identities })
    return Promise.resolve(label)
  }

  /**
   * Setter for the `currentAccountTab` property
   *
   * @param {string} currentAccountTab Specifies the new tab to be marked as current
   * @returns {Promise<void>} Promise resolves with undefined
   *
   */
  setCurrentAccountTab (currentAccountTab) {
    return new Promise((resolve, reject) => {
      this.store.updateState({ currentAccountTab })
      resolve()
    })
  }

  /**
   * Updates the `featureFlags` property, which is an object. One property within that object will be set to a boolean.
   *
   * @param {string} feature A key that corresponds to a UI feature.
   * @param {boolean} activated Indicates whether or not the UI feature should be displayed
   * @returns {Promise<object>} Promises a new object; the updated featureFlags object.
   *
   */
  setFeatureFlag (feature, activated) {
    const currentFeatureFlags = this.store.getState().featureFlags
    const updatedFeatureFlags = {
      ...currentFeatureFlags,
      [feature]: activated,
    }

    this.store.updateState({ featureFlags: updatedFeatureFlags })

    return Promise.resolve(updatedFeatureFlags)
  }

  /**
   * A getter for the `featureFlags` property
   *
   * @returns {object} A key-boolean map, where keys refer to features and booleans to whether the
   * user wishes to see that feature
   *
   */
  getFeatureFlags () {
    return this.store.getState().featureFlags
  }

  /**
   * Updates the `preferences` property, which is an object. These are user-controlled features
   * found in the settings page.
   * @param {string} preference The preference to enable or disable.
   * @param {boolean} value Indicates whether or not the preference should be enabled or disabled.
   * @returns {Promise<object>} Promises a new object; the updated preferences object.
   */
  setPreference (preference, value) {
    const currentPreferences = this.getPreferences()
    const updatedPreferences = {
      ...currentPreferences,
      [preference]: value,
    }

    this.store.updateState({ preferences: updatedPreferences })
    return Promise.resolve(updatedPreferences)
  }

  /**
   * A getter for the `preferences` property
   * @returns {object} A key-boolean map of user-selected preferences.
   */
  getPreferences () {
    return this.store.getState().preferences
  }

  /**
   * Sets the completedOnboarding state to true, indicating that the user has completed the
   * onboarding process.
   */
  completeOnboarding () {
    this.store.updateState({ completedOnboarding: true })
    return Promise.resolve(true)
  }

  /**
   * Sets the {@code completedUiMigration} state to {@code true}, indicating that the user has completed the UI switch.
   */
  completeUiMigration () {
    this.store.updateState({ completedUiMigration: true })
    return Promise.resolve(true)
  }
  /**
   * Updates `accountTokens` and `tokens` of current account and network according to it.
   *
   * @param {array} tokens Array of tokens to be updated.
   *
   */
  _updateAccountTokens (tokens, assetImages) {
    const { accountTokens, providerType, selectedAddress } = this._getTokenRelatedStates()
    accountTokens[selectedAddress][providerType] = tokens
    this.store.updateState({ accountTokens, tokens, assetImages })
  }

    /**
   * Updates `tokens` of current account.
   *
   * @param {string} selectedAddress Account address to be updated with.
   *
   */
  _updateTokens (selectedAddress) {
    const { tokens } = this._getTokenRelatedStates(selectedAddress)
    this.store.updateState({ tokens })
  }

     /**
   * A getter for `tokens` and `accountTokens` related states.
   *
   * @param {string} selectedAddress A new  address for an account
   * @returns {Object.<array, object, string, string>} States to interact with tokens in `accountTokens`
   *
   */
  _getTokenRelatedStates (selectedAddress) {
    const accountTokens = this.store.getState().accountTokens
    if (!selectedAddress) selectedAddress = this.store.getState().selectedAddress
    if (!(selectedAddress in accountTokens)) accountTokens[selectedAddress] = {}
    return { accountTokens, selectedAddress }
  }
}

module.exports = PreferencesController
