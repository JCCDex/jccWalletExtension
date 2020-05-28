import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Media from 'react-media'
import { Redirect } from 'react-router-dom'
import WalletView from '../../wallet-view'
import TransactionView from '../../transaction-view'
import ProviderApproval from '../provider-approval'

import {
  INITIALIZE_SEED_PHRASE_ROUTE,
  RESTORE_VAULT_ROUTE,
  CONFIRM_ADD_SUGGESTED_TOKEN_ROUTE,
} from '../../../routes'

export default class Home extends PureComponent {
  static propTypes = {
    history: PropTypes.object,
    forgottenPassword: PropTypes.bool,
    seedWords: PropTypes.string,
    suggestedTokens: PropTypes.object,
    providerRequests: PropTypes.array,
  }

  componentDidMount () {
    const {
      history,
      suggestedTokens = {},
    } = this.props

    // suggested new tokens
    if (Object.keys(suggestedTokens).length > 0) {
        history.push(CONFIRM_ADD_SUGGESTED_TOKEN_ROUTE)
    }

  }

  render () {
    const {
      forgottenPassword,
      seedWords,
      providerRequests,
    } = this.props

    // seed words
    if (seedWords) {
     // return <Redirect to={{ pathname: INITIALIZE_SEED_PHRASE_ROUTE }}/>
    }

    if (forgottenPassword) {
      return <Redirect to={{ pathname: RESTORE_VAULT_ROUTE }} />
    }

    if (providerRequests && providerRequests.length > 0) {
      return (
        <ProviderApproval providerRequest={providerRequests[0]} />
      )
    }

    return (
      <div className="main-container">
        <div className="account-and-transaction-details">
          <Media
            query="(min-width: 576px)"
            render={() => <WalletView />}
          />
          <TransactionView />
        </div>
      </div>
    )
  }
}
