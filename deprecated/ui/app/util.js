import { DateTime } from 'luxon'
const Wallet = require('jcc_jingtum_base_lib').Wallet

// formatData :: ( date: <Unix Timestamp> ) -> String
function formatDate (date, format = 'M/d/y \'at\' T') {
  return DateTime.fromMillis(date).toFormat(format)
}

var valueTable = {
  wei: '1000000000000000000',
  kwei: '1000000000000000',
  mwei: '1000000000000',
  gwei: '1000000000',
  szabo: '1000000',
  finney: '1000',
  ether: '1',
  kether: '0.001',
  mether: '0.000001',
  gether: '0.000000001',
  tether: '0.000000000001',
}


module.exports = {
  valuesFor: valuesFor,
  isAllOneCase: isAllOneCase,
  numericBalance: numericBalance,
  isValidAddress: isValidAddress,
  parseBalance: parseBalance,
  formatBalance: formatBalance,
  generateBalanceObject: generateBalanceObject,
  //dataSize: dataSize,
  readableDate: readableDate,
  valueTable: valueTable,
 // bnTable: bnTable,
  formatDate,
  shortenBalance,
  exportAsFile: exportAsFile,
  allNull,
  getTokenAddressFromTokenObject,
  addressSlicer,
}

function valuesFor (obj) {
  if (!obj) return []
  return Object.keys(obj)
    .map(function (key) { return obj[key] })
}

function isValidAddress (address) {
  return Wallet.isValidAddress(address, 'swt')
}

function isAllOneCase (address) {
  if (!address) return true
  var lower = address.toLowerCase()
  var upper = address.toUpperCase()
  return address === lower || address === upper
}

// Takes wei Hex, returns wei BN, even if input is null
function numericBalance (balance) {
  return balance
}

// Takes  hex, returns [beforeDecimal, afterDecimal]
function parseBalance (balance) {
  var beforeDecimal, afterDecimal
  const wei = numericBalance(balance)
  var weiString = wei.toString()
  const trailingZeros = /0+$/

  beforeDecimal = weiString.length > 18 ? weiString.slice(0, weiString.length - 18) : '0'
  afterDecimal = ('000000000000000000' + wei).slice(-18).replace(trailingZeros, '')
  if (afterDecimal === '') { afterDecimal = '0' }
  return [beforeDecimal, afterDecimal]
}

// Takes wei hex, returns an object with three properties.
// Its "formatted" property is what we generally use to render values.
function formatBalance (balance, decimalsToKeep, needsParse = true, ticker = 'ETH') {
  var parsed = needsParse ? parseBalance(balance) : balance.split('.')
  var beforeDecimal = parsed[0]
  var afterDecimal = parsed[1]
  var formatted = 'None'
  if (decimalsToKeep === undefined) {
    if (beforeDecimal === '0') {
      if (afterDecimal !== '0') {
        var sigFigs = afterDecimal.match(/^0*(.{2})/) // default: grabs 2 most significant digits
        if (sigFigs) { afterDecimal = sigFigs[0] }
        formatted = '0.' + afterDecimal + ` ${ticker}`
      }
    } else {
      formatted = beforeDecimal + '.' + afterDecimal.slice(0, 3) + ` ${ticker}`
    }
  } else {
    afterDecimal += Array(decimalsToKeep).join('0')
    formatted = beforeDecimal + '.' + afterDecimal.slice(0, decimalsToKeep) + ` ${ticker}`
  }
  return formatted
}


function generateBalanceObject (formattedBalance, decimalsToKeep = 1) {
  var balance = formattedBalance.split(' ')[0]
  var label = formattedBalance.split(' ')[1]
  var beforeDecimal = balance.split('.')[0]
  var afterDecimal = balance.split('.')[1]
  var shortBalance = shortenBalance(balance, decimalsToKeep)

  if (beforeDecimal === '0' && afterDecimal.substr(0, 5) === '00000') {
    // eslint-disable-next-line eqeqeq
    if (afterDecimal == 0) {
      balance = '0'
    } else {
      balance = '<1.0e-5'
    }
  } else if (beforeDecimal !== '0') {
    balance = `${beforeDecimal}.${afterDecimal.slice(0, decimalsToKeep)}`
  }

  return { balance, label, shortBalance }
}

function shortenBalance (balance, decimalsToKeep = 1) {
  var truncatedValue
  var convertedBalance = parseFloat(balance)
  if (convertedBalance > 1000000) {
    truncatedValue = (balance / 1000000).toFixed(decimalsToKeep)
    return `${truncatedValue}m`
  } else if (convertedBalance > 1000) {
    truncatedValue = (balance / 1000).toFixed(decimalsToKeep)
    return `${truncatedValue}k`
  } else if (convertedBalance === 0) {
    return '0'
  } else if (convertedBalance < 0.001) {
    return '<0.001'
  } else if (convertedBalance < 1) {
    var stringBalance = convertedBalance.toString()
    if (stringBalance.split('.')[1].length > 3) {
      return convertedBalance.toFixed(3)
    } else {
      return stringBalance
    }
  } else {
    return convertedBalance.toFixed(decimalsToKeep)
  }
}


function readableDate (ms) {
  var date = new Date(ms)
  var month = date.getMonth()
  var day = date.getDate()
  var year = date.getFullYear()
  var hours = date.getHours()
  var minutes = '0' + date.getMinutes()
  var seconds = '0' + date.getSeconds()

  var dateStr = `${month}/${day}/${year}`
  var time = `${hours}:${minutes.substr(-2)}:${seconds.substr(-2)}`
  return `${dateStr} ${time}`
}


function exportAsFile (filename, data, type = 'text/csv') {
  // source: https://stackoverflow.com/a/33542499 by Ludovic Feltz
  const blob = new Blob([data], {type})
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveBlob(blob, filename)
  } else {
    const elem = window.document.createElement('a')
    elem.target = '_blank'
    elem.href = window.URL.createObjectURL(blob)
    elem.download = filename
    document.body.appendChild(elem)
    elem.click()
    document.body.removeChild(elem)
  }
}

function allNull (obj) {
  return Object.entries(obj).every(([key, value]) => value === null)
}

function getTokenAddressFromTokenObject (token) {
  return Object.values(token)[0].address.toLowerCase()
}


function addressSlicer (address = '') {
  if (address.length < 11) {
    return address
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`
}
