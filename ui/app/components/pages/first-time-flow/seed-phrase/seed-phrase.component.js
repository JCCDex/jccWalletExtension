import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Switch, Route } from 'react-router-dom'
import RevealSeedPhrase from './reveal-seed-phrase'
import ConfirmSeedPhrase from './confirm-seed-phrase'
import {
  INITIALIZE_SEED_PHRASE_ROUTE,
  INITIALIZE_CONFIRM_SEED_PHRASE_ROUTE,
  DEFAULT_ROUTE,
} from '../../../../routes'

export default class SeedPhrase extends PureComponent {
  static propTypes = {
    address: PropTypes.string,
    history: PropTypes.object,
    keypairs: PropTypes.object,
  }

  componentDidMount () {
    const { keypairs, history } = this.props

    if (!keypairs) {
      history.push(DEFAULT_ROUTE)
    }
  }

  render () {
    const { keypairs } = this.props

    return (
      <div className="first-time-flow__wrapper">
        <div className="app-header__logo-container">
          <img
            className="app-header__metafox-logo app-header__metafox-logo--horizontal"
            src="/images/logo/swtclogo.png"
            width={163}
            height={50}
          />
          <img
            className="app-header__metafox-logo app-header__metafox-logo--icon"
            src="/images/logo/jingtum.png"
            height={42}
            width={42}
          />
        </div>
        <Switch>
        <Route
            exact
            path={INITIALIZE_CONFIRM_SEED_PHRASE_ROUTE}
            render={props => (
              <ConfirmSeedPhrase
                { ...props }
                keypairs={keypairs}
              />
            )}
          />
          <Route
            exact
            path={INITIALIZE_SEED_PHRASE_ROUTE}
            render={props => (
              <RevealSeedPhrase
                { ...props }
                keypairs={keypairs}
              />
            )}
          />
        </Switch>
      </div>
    )
  }
}
