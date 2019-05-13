import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Button from '../../../../button'
import JingchangWallet from 'jcc_wallet/lib/jingchangWallet'
import {
  INITIALIZE_SELECT_ACTION_ROUTE,
  INITIALIZE_END_OF_FLOW_ROUTE,
} from '../../../../../routes'

export default class ImportWithSeedPhrase extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
    metricsEvent: PropTypes.func,
  }

  static propTypes = {
    history: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
  }

  state = {
    seedPhrase: '',
    seedPhraseError: '',
    termsChecked: false,
  }

  handleSeedPhraseChange (seedPhrase) {
    let seedPhraseError = ''
    if (seedPhrase) {
       if (!JingchangWallet.isValid(seedPhrase)) {
        seedPhraseError = this.context.t('invalidSeedPhrase')  
      }
    }
    this.setState({ seedPhrase, seedPhraseError })
  }


  handleImport = async event => {
    event.preventDefault()

    if (!this.isValid()) {
      return
    }

    const { seedPhrase } = this.state
    const { history, onSubmit } = this.props
    try {
      await onSubmit(seedPhrase)
      this.context.metricsEvent({
        eventOpts: {
          category: 'Onboarding',
          action: 'Import Seed Phrase',
          name: 'Import Complete',
        },
      })
      history.push(INITIALIZE_END_OF_FLOW_ROUTE)
    } catch (error) {
      this.setState({ seedPhraseError: error.message })
    }
  }

  isValid () {
    const {
      seedPhrase,
      //password,
     // confirmPassword,
     // passwordError,
      //confirmPasswordError,
      seedPhraseError,
    } = this.state

    if ( !seedPhrase ) {
      return false
    }

    return  !seedPhraseError
  }

  toggleTermsCheck = () => {
    this.context.metricsEvent({
      eventOpts: {
        category: 'Onboarding',
        action: 'Import Seed Phrase',
        name: 'Check ToS',
      },
    })

  }

  render () {
    const { t } = this.context
    const { seedPhraseError } = this.state

    return (
      <form
        className="first-time-flow__form"
        onSubmit={this.handleImport}
      >
        <div className="first-time-flow__create-back">
          <a
            onClick={e => {
              e.preventDefault()
              this.context.metricsEvent({
                eventOpts: {
                  category: 'Onboarding',
                  action: 'Import Seed Phrase',
                  name: 'Go Back from Onboarding Import',
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
          { t('importAccountSeedPhrase') }
        </div>
        <div className="first-time-flow__text-block">
          { t('secretPhrase') }
        </div>
        <div className="first-time-flow__textarea-wrapper">
          <textarea
            className="first-time-flow__textarea"
            onChange={e => this.handleSeedPhraseChange(e.target.value)}
            value={this.state.seedPhrase}
          />
        </div>
        {
          seedPhraseError && (
            <span className="error">
              { seedPhraseError }
            </span>
          )
        }
       
        <Button
          type="confirm"
          className="first-time-flow__button"
          disabled={!this.isValid()}
          onClick={this.handleImport}
        >
          { t('import') }
        </Button>
      </form>
    )
  }
}
