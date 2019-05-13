const {
  REQUIRED_ERROR,
  INVALID_RECIPIENT_ADDRESS_ERROR,
  KNOWN_RECIPIENT_ADDRESS_ERROR,
} = require('../../send.constants')
const { isValidAddress } = require('../../../../util')
import { checkExistingAddresses } from '../../../pages/add-token/util'

const ethUtil = require('ethereumjs-util')
const contractMap = require('eth-contract-metadata')

function getToErrorObject (to, toError = null, hasHexData = false, tokens = [], selectedToken = null, network) {
  if (!to) {
    if (!hasHexData) {
      toError = REQUIRED_ERROR
    }
  } else if (!isValidAddress(to) && !toError) {
    toError = INVALID_RECIPIENT_ADDRESS_ERROR
  } else if (selectedToken && checkExistingAddresses(to, tokens)) {
    toError = KNOWN_RECIPIENT_ADDRESS_ERROR
  }
  return { to: toError }
}

function getToWarningObject (to, toWarning = null, tokens = [], selectedToken = null) {
  if (selectedToken && (ethUtil.toChecksumAddress(to) in contractMap || checkExistingAddresses(to, tokens))) {
    toWarning = KNOWN_RECIPIENT_ADDRESS_ERROR
  }
  return { to: toWarning }
}

module.exports = {
  getToErrorObject,
  getToWarningObject,
}
