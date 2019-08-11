const { getSendErrors } = require('../order.selectors')

const selectors = {
  isSendFormInError,
}

module.exports = selectors

function isSendFormInError (state) {
  return Object.values(getSendErrors(state)).some(n => n)
}
