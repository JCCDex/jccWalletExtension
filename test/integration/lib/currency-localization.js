const reactTriggerChange = require('../../lib/react-trigger-change')
const {
  timeout,
  queryAsync,
  findAsync,
} = require('../../lib/util')
const fetchMockResponses = require('../../e2e/beta/fetch-mocks.js')

QUnit.module('currency localization')

QUnit.test('renders localized currency', (assert) => {
  const done = assert.async()
  runCurrencyLocalizationTest(assert).then(done).catch((err) => {
    assert.notOk(err, `Error was thrown: ${err.stack}`)
    done()
  })
})

async function runCurrencyLocalizationTest (assert, done) {
  console.log('*** start runCurrencyLocalizationTest')
  const selectState = await queryAsync($, 'select')
  selectState.val('currency localization')

  global.fetch = (...args) => {
    if (args[0].match(/chromeextensionmm/)) {
      return Promise.resolve({ json: () => Promise.resolve(JSON.parse(fetchMockResponses.metametrics)) })
    }
    return window.fetch(...args)
  }

  await timeout(1000)
  reactTriggerChange(selectState[0])
  await timeout(1000)
  const txView = await queryAsync($, '.transaction-view')
  const heroBalance = await findAsync($(txView), '.transaction-view-balance__balance')
  const fiatAmount = await findAsync($(heroBalance), '.transaction-view-balance__secondary-balance')
  assert.equal(fiatAmount[0].textContent, '₱102,707.97PHP')
}
