const { Component } = require('react')
const PropTypes = require('prop-types')
const { Provider } = require('react-redux')
const h = require('react-hyperscript')
const { HashRouter } = require('react-router-dom')
const App = require('./app')
const I18nProvider = require('./i18n-provider')
const MetaMetricsProvider = require('./metametrics/metametrics.provider')

class Root extends Component {
  render () {
    const { store } = this.props

    return (
      h(Provider, { store }, [
        h(HashRouter, {
          hashType: 'noslash',
        }, [
           h(MetaMetricsProvider, [
            h(I18nProvider, [
              h(App),
            ]),
          ]),
        ]),
      ])
    )
  }
}

Root.propTypes = {
  store: PropTypes.object,
}

module.exports = Root
