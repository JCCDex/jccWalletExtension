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
    setNetwork:PropTypes.func,
    selectedWalletType:PropTypes.string,
    addNetwork:PropTypes.func,
    deleteNetwork:PropTypes.func,
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
    const {deleteNetwork,selectedWalletType} = this.props
    this.props.history.push(INITIALIZE_SELECT_ACTION_ROUTE)
  }

  render () {
    const { t } = this.context

    return (
      <div className="welcome-page__wrapper">
        <div className="welcome-page">
        <img
            className="welcome-page__icon"
            src="/images/logo/JCCwallet.png"
            height={110}
            width={111}
          />
          <div className="welcome-page__appname ">
            {t('welcome')} { t('appName')}
          </div>
          <div className="welcome-page__description">
            <div>{ t('metamaskDescription') }</div>
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
