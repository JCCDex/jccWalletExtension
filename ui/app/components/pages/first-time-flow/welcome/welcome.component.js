import EventEmitter from 'events'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Button from '../../../button'
import { INITIALIZE_CREATE_PASSWORD_ROUTE, INITIALIZE_SELECT_ACTION_ROUTE } from '../../../../routes'

export default class Welcome extends PureComponent {
  static propTypes = {
    history: PropTypes.object,
    isInitialized: PropTypes.bool,
    participateInMetaMetrics: PropTypes.bool,
    welcomeScreenSeen: PropTypes.bool,
  }

  static contextTypes = {
    t: PropTypes.func,
  }

  constructor (props) {
    super(props)

    this.animationEventEmitter = new EventEmitter()
  }

  componentDidMount () {
    const { history, participateInMetaMetrics, welcomeScreenSeen } = this.props

    if (welcomeScreenSeen && participateInMetaMetrics !== null) {
      history.push(INITIALIZE_CREATE_PASSWORD_ROUTE)
    } else if (welcomeScreenSeen) {
      history.push(INITIALIZE_SELECT_ACTION_ROUTE)
    }
  }

  handleContinue = () => {
    this.props.history.push(INITIALIZE_SELECT_ACTION_ROUTE)
  }

  render () {
    const { t } = this.context

    return (
      <div className="welcome-page__wrapper">
        <div className="welcome-page">
        <img
            className="app-header__metafox-logo app-header__metafox-logo--icon"
            src="/images/logo/jingtum.png"
            height={125}
            width={125}
          />
          <div className="welcome-page__header">
            { t('welcome') }
          </div>
          <div className="welcome-page__description">
            <div>{ t('metamaskDescription') }</div>
            <div>{ t('happyToSeeYou') }</div>
          </div>
          <Button
            type="confirm"
            className="first-time-flow__button"
            onClick={this.handleContinue}
          >
            { t('getStarted') }
          </Button>
        </div>
      </div>
    )
  }
}
