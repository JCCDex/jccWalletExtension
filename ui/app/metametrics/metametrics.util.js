/* eslint camelcase: 0 */


const inDevelopment = process.env.NODE_ENV === 'development'


const METAMETRICS_CUSTOM_FUNCTION_TYPE = 'functionType'
const METAMETRICS_CUSTOM_RECIPIENT_KNOWN = 'recipientKnown'
const METAMETRICS_CUSTOM_CONFIRM_SCREEN_ORIGIN = 'origin'
const METAMETRICS_CUSTOM_ERROR_FIELD = 'errorField'
const METAMETRICS_CUSTOM_ERROR_MESSAGE = 'errorMessage'


const METAMETRICS_CUSTOM_ENVIRONMENT_TYPE = 'environmentType'
const METAMETRICS_CUSTOM_ACTIVE_CURRENCY = 'activeCurrency'
const METAMETRICS_CUSTOM_ACCOUNT_TYPE = 'accountType'
const METAMETRICS_CUSTOM_NUMBER_OF_TOKENS = 'numberOfTokens'
const METAMETRICS_CUSTOM_NUMBER_OF_ACCOUNTS = 'numberOfAccounts'

const customVariableNameIdMap = {
  [METAMETRICS_CUSTOM_FUNCTION_TYPE]: 1,
  [METAMETRICS_CUSTOM_RECIPIENT_KNOWN]: 2,
  [METAMETRICS_CUSTOM_CONFIRM_SCREEN_ORIGIN]: 3,
  [METAMETRICS_CUSTOM_ERROR_FIELD]: 1,
  [METAMETRICS_CUSTOM_ERROR_MESSAGE]: 2,
}

const customDimensionsNameIdMap = {
  [METAMETRICS_CUSTOM_ENVIRONMENT_TYPE]: 6,
  [METAMETRICS_CUSTOM_ACTIVE_CURRENCY]: 7,
  [METAMETRICS_CUSTOM_ACCOUNT_TYPE]: 8,
  [METAMETRICS_CUSTOM_NUMBER_OF_TOKENS]: 9,
  [METAMETRICS_CUSTOM_NUMBER_OF_ACCOUNTS]: 10,
}

function composeUrlRefParamAddition (previousPath, confirmTransactionOrigin) {
  const externalOrigin = confirmTransactionOrigin && confirmTransactionOrigin !== 'MetaMask'
  return `&urlref=${externalOrigin ? 'EXTERNAL' : encodeURIComponent(previousPath.replace(/chrome-extension:\/\/\w+/, METAMETRICS_TRACKING_URL))}`
}

function composeCustomDimensionParamAddition (customDimensions) {
  const customDimensionParamStrings = Object.keys(customDimensions).reduce((acc, name) => {
    return [...acc, `dimension${customDimensionsNameIdMap[name]}=${customDimensions[name]}`]
  }, [])
  return `&${customDimensionParamStrings.join('&')}`
}

function composeCustomVarParamAddition (customVariables) {
  const customVariableIdValuePairs = Object.keys(customVariables).reduce((acc, name) => {
    return {
      [customVariableNameIdMap[name]]: [name, customVariables[name]],
      ...acc,
    }
  }, {})
  return `&cvar=${encodeURIComponent(JSON.stringify(customVariableIdValuePairs))}`
}

function composeParamAddition (paramValue, paramName) {
  return paramValue !== 0 && !paramValue
    ? ''
    : `&${paramName}=${paramValue}`
}

function composeUrl (config, permissionPreferences = {}) {
  const {
    eventOpts = {},
    customVariables = '',
    pageOpts = '',
    environmentType,
    activeCurrency,
    accountType,
    numberOfTokens,
    numberOfAccounts,
    previousPath = '',
    currentPath,
    metaMetricsId,
    confirmTransactionOrigin,
    url: configUrl,
    excludeMetaMetricsId,
    isNewVisit,
  } = config
  const base = METAMETRICS_BASE_FULL

  const e_c = composeParamAddition(eventOpts.category, 'e_c')
  const e_a = composeParamAddition(eventOpts.action, 'e_a')
  const e_n = composeParamAddition(eventOpts.name, 'e_n')
  const new_visit = isNewVisit ? `&new_visit=1` : ''

  const cvar = customVariables && composeCustomVarParamAddition(customVariables) || ''

  const action_name = ''

  const urlref = previousPath && composeUrlRefParamAddition(previousPath, confirmTransactionOrigin)

  const dimensions = !pageOpts.hideDimensions ? composeCustomDimensionParamAddition({
    environmentType,
    activeCurrency,
    accountType,
    numberOfTokens: customVariables && customVariables.numberOfTokens || numberOfTokens,
    numberOfAccounts: customVariables && customVariables.numberOfAccounts || numberOfAccounts,
  }) : ''
  const url = configUrl || `&url=${encodeURIComponent(currentPath.replace(/chrome-extension:\/\/\w+/, METAMETRICS_TRACKING_URL))}`
  const _id = metaMetricsId && !excludeMetaMetricsId ? `&_id=${metaMetricsId.slice(2, 18)}` : ''
  const rand = `&rand=${String(Math.random()).slice(2)}`
  const uid = metaMetricsId && !excludeMetaMetricsId
    ? `&uid=${metaMetricsId.slice(2, 18)}`
    : excludeMetaMetricsId
      ? '&uid=0000000000000000'
      : ''

  return [ base, e_c, e_a, e_n, cvar, action_name, urlref, dimensions, url, _id, rand, uid, new_visit ].join('')
}

export function sendMetaMetricsEvent (config, permissionPreferences) {
  return fetch(composeUrl(config, permissionPreferences), {
    'headers': {},
    'method': 'GET',
  })
}

export function verifyUserPermission (config, props) {
  const {
    eventOpts = {},
  } = config
  const { userPermissionPreferences } = props
  const {
    allowAll,
    allowNone,
    allowSendMetrics,
  } = userPermissionPreferences

  if (allowNone) {
    return false
  } else if (allowAll) {
    return true
  } else if (allowSendMetrics && eventOpts.name === 'send') {
    return true
  } else {
    return false
  }
}

const trackableSendCounts = {
  1: true,
  10: true,
  30: true,
  50: true,
  100: true,
  250: true,
  500: true,
  1000: true,
  2500: true,
  5000: true,
  10000: true,
  25000: true,
}

export function sendCountIsTrackable (sendCount) {
  return Boolean(trackableSendCounts[sendCount])
}
