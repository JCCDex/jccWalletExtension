import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Button from '../../../../button'
import {
  INITIALIZE_SEED_PHRASE_ROUTE,
  INITIALIZE_IMPORT_WITH_SEED_PHRASE_ROUTE,
  INITIALIZE_SELECT_ACTION_ROUTE,
} from '../../../../../routes'
import TextField from '../../../../text-field'

export default class NewAccount extends PureComponent {
  static contextTypes = {
    metricsEvent: PropTypes.func,
    t: PropTypes.func,
  }

  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  }

  state = {
    password: '',
    confirmPassword: '',
    passwordError: '',
    confirmPasswordError: '',
  }

  isValid () {
    const {
      password,
      confirmPassword,
      passwordError,
      confirmPasswordError,
    } = this.state

    if (!password || !confirmPassword || password !== confirmPassword) {
      return false
    }

    if (password.length < 8) {
      return false
    }

    return !passwordError && !confirmPasswordError
  }

  handlePasswordChange (password) {
    const { t } = this.context

    this.setState(state => {
      const { confirmPassword } = state
      let passwordError = ''
      let confirmPasswordError = ''

      if (password && password.length < 8) {
        passwordError = t('passwordNotLongEnough')
      }

      if (confirmPassword && password !== confirmPassword) {
        confirmPasswordError = t('passwordsDontMatch')
      }

      return {
        password,
        passwordError,
        confirmPasswordError,
      }
    })
  }

  handleConfirmPasswordChange (confirmPassword) {
    const { t } = this.context

    this.setState(state => {
      const { password } = state
      let confirmPasswordError = ''

      if (password !== confirmPassword) {
        confirmPasswordError = t('passwordsDontMatch')
      }

      return {
        confirmPassword,
        confirmPasswordError,
      }
    })
  }

  handleCreate = async event => {
    event.preventDefault()

    if (!this.isValid()) {
      return
    }

    const { password } = this.state
    const { onSubmit, history } = this.props

    try {
      await onSubmit(password)

      this.context.metricsEvent({
        eventOpts: {
          category: 'Onboarding',
          action: 'Create Password',
          name: 'Submit Password',
        },
      })

      history.push(INITIALIZE_SEED_PHRASE_ROUTE)
    } catch (error) {
      this.setState({ passwordError: error.message })
    }
  }

  handleImportWithSeedPhrase = event => {
    const { history } = this.props

    event.preventDefault()
    history.push(INITIALIZE_IMPORT_WITH_SEED_PHRASE_ROUTE)
  }

  toggleTermsCheck = () => {
    this.context.metricsEvent({
      eventOpts: {
        category: 'Onboarding',
        action: 'Create Password',
        name: 'Check ToS',
      },
    })
  }

  render () {
    const { t } = this.context
    const { password, confirmPassword, passwordError, confirmPasswordError } = this.state

    return (
      <div>
        <div className="first-time-flow__create-back">
          <a
            onClick={e => {
              e.preventDefault()
              this.context.metricsEvent({
                eventOpts: {
                  category: 'Onboarding',
                  action: 'Create Password',
                  name: 'Go Back from Onboarding Create',
                },
              })
              this.props.history.push(INITIALIZE_SELECT_ACTION_ROUTE)
            }}
            href="#"
          >
            {`< Back`}
          </a>
        </div>
        <div className="first-time-flow__header">
          { t('createPassword') }
        </div>
        <form
          className="first-time-flow__form"
          onSubmit={this.handleCreate}
        >
          <TextField
            id="create-password"
            label={t('newPassword')}
            type="password"
            className="first-time-flow__input"
            value={password}
            onChange={event => this.handlePasswordChange(event.target.value)}
            error={passwordError}
            autoFocus
            autoComplete="new-password"
            margin="normal"
            fullWidth
            largeLabel
          />
          <TextField
            id="confirm-password"
            label={t('confirmPassword')}
            type="password"
            className="first-time-flow__input"
            value={confirmPassword}
            onChange={event => this.handleConfirmPasswordChange(event.target.value)}
            error={confirmPasswordError}
            autoComplete="confirm-password"
            margin="normal"
            fullWidth
            largeLabel
          />
          <Button
            type="confirm"
            className="first-time-flow__button"
            disabled={!this.isValid()}
            onClick={this.handleCreate}
          >
            { t('create') }
          </Button>
        </form>
      </div>
    )
  }
}
