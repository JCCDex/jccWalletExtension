import { createSelector } from 'reselect'
import {
  UNAPPROVED_STATUS,
  APPROVED_STATUS,
  SUBMITTED_STATUS,
  CONFIRMED_STATUS,
} from '../constants/transactions'
import {
  TRANSACTION_TYPE_CANCEL,
  TRANSACTION_TYPE_RETRY,
} from '../../../app/scripts/controllers/transactions/enums'
import { hexToDecimal } from '../helpers/conversions.util'

import { selectedTokenAddressSelector } from './tokens'

export const selectedAddressTxListSelector = state => state.metamask.selectedAddressTxList


export const transactionsSelector = createSelector(
  selectedTokenAddressSelector,
  selectedAddressTxListSelector,
  (selectedTokenAddress, transactions = []) => {
    const txsToRender = transactions

    return selectedTokenAddress
      ? txsToRender
        .filter(({ txParams }) => txParams && txParams.to === selectedTokenAddress)
        .sort((a, b) => b.time - a.time)
      : txsToRender
        .sort((a, b) => b.time - a.time)
  }
)

/**
 * @name insertOrderedNonce
 * @private
 * @description Inserts (mutates) a nonce into an array of ordered nonces, sorted in ascending
 * order.
 * @param {string[]} nonces - Array of nonce strings in hex
 * @param {string} nonceToInsert - Nonce string in hex to be inserted into the array of nonces.
 * @returns {string[]}
 */
const insertOrderedNonce = (nonces, nonceToInsert) => {
  let insertIndex = nonces.length

  for (let i = 0; i < nonces.length; i++) {
    const nonce = nonces[i]

    if (Number(hexToDecimal(nonce)) > Number(hexToDecimal(nonceToInsert))) {
      insertIndex = i
      break
    }
  }

  nonces.splice(insertIndex, 0, nonceToInsert)
}

/**
 * @name insertTransactionByTime
 * @private
 * @description Inserts (mutates) a transaction object into an array of ordered transactions, sorted
 * in ascending order by time.
 * @param {Object[]} transactions - Array of transaction objects.
 * @param {Object} transaction - Transaction object to be inserted into the array of transactions.
 * @returns {Object[]}
 */
const insertTransactionByTime = (transactions, transaction) => {
  const { time } = transaction

  let insertIndex = transactions.length

  for (let i = 0; i < transactions.length; i++) {
    const tx = transactions[i]

    if (tx.time > time) {
      insertIndex = i
      break
    }
  }

  transactions.splice(insertIndex, 0, transaction)
}

/**
 * @name nonceSortedCompletedTransactionsSelector
 * @description Returns an array of transactionGroups where transactions are confirmed sorted by
 * nonce in descending order.
 * @returns {transactionGroup[]}
 */
export const nonceSortedCompletedTransactionsSelector = createSelector(
 // nonceSortedTransactionsSelector,
  (transactions = []) => (
    transactions
      .reverse()
  )
)

/**
 * Contains transactions and properties associated with those transactions of the same nonce.
 * @typedef {Object} transactionGroup
 * @property {string} nonce - The nonce that the transactions within this transactionGroup share.
 * @property {Object[]} transactions - An array of transaction (txMeta) objects.
 * @property {Object} initialTransaction - The transaction (txMeta) with the lowest "time".
 * @property {Object} primaryTransaction - Either the latest transaction or the confirmed
 * transaction.
 * @property {boolean} hasRetried - True if a transaction in the group was a retry transaction.
 * @property {boolean} hasCancelled - True if a transaction in the group was a cancel transaction.
 */

/**
 * @name insertTransactionGroupByTime
 * @private
 * @description Inserts (mutates) a transactionGroup object into an array of ordered
 * transactionGroups, sorted in ascending order by nonce.
 * @param {transactionGroup[]} transactionGroups - Array of transactionGroup objects.
 * @param {transactionGroup} transactionGroup - transactionGroup object to be inserted into the
 * array of transactionGroups.
 */
const insertTransactionGroupByTime = (transactionGroups, transactionGroup) => {
  const { primaryTransaction: { time: groupToInsertTime } = {} } = transactionGroup

  let insertIndex = transactionGroups.length

  for (let i = 0; i < transactionGroups.length; i++) {
    const txGroup = transactionGroups[i]
    const { primaryTransaction: { time } = {} } = txGroup

    if (time > groupToInsertTime) {
      insertIndex = i
      break
    }
  }

  transactionGroups.splice(insertIndex, 0, transactionGroup)
}

