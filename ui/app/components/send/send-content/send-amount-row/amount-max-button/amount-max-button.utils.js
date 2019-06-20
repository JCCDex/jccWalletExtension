const {
  multiplyCurrencies,
} = require('../../../../../conversion-util')

function calcMaxAmount ({ balance, selectedToken, tokenBalance }) {
  const { decimals } = selectedToken || {}
  const multiplier = Math.pow(10, Number(decimals || 0))

  return selectedToken
    multiplyCurrencies(
      tokenBalance,
      multiplier,
      {
        toNumericBase: 'hex',
        multiplicandBase: 16,
      }
    )
}

module.exports = {
  calcMaxAmount,
}
