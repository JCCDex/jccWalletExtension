
import { conversionUtil, addCurrencies } from '../conversion-util'

export function hexToDecimal (hexValue) {
  return conversionUtil(hexValue, {
    fromNumericBase: 'hex',
    toNumericBase: 'dec',
  })
}

export function decimalToHex (decimal) {
  return conversionUtil(decimal, {
    fromNumericBase: 'dec',
    toNumericBase: 'hex',
  })
}

