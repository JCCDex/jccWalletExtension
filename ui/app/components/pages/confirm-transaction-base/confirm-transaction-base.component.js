import ethUtil from 'ethereumjs-util'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ConfirmPageContainer, { ConfirmDetailRow } from '../../confirm-page-container'
import { isBalanceSufficient } from '../../send/send.utils'
import { DEFAULT_ROUTE, CONFIRM_TRANSACTION_ROUTE } from '../../../routes'
import {
  INSUFFICIENT_FUNDS_ERROR_KEY,
  TRANSACTION_ERROR_KEY,
} from '../../../constants/error-keys'
import { CONFIRMED_STATUS, DROPPED_STATUS } from '../../../constants/transactions'
import UserPreferencedCurrencyDisplay from '../../user-preferenced-currency-display'
import { PRIMARY, SECONDARY } from '../../../constants/common'
import AdvancedGasInputs from '../../gas-customization/advanced-gas-inputs'

export default class ConfirmTransactionBase extends Component {
  static contextTypes = {
    t: PropTypes.func,
    metricsEvent: PropTypes.func,
  }

  static propTypes = {
    // react-router props
    match: PropTypes.object,
    history: PropTypes.object,
    // Redux props
    balance: PropTypes.string,
    cancelTransaction: PropTypes.func,
    cancelAllTransactions: PropTypes.func,
    clearConfirmTransaction: PropTypes.func,
    clearSend: PropTypes.func,
    conversionRate: PropTypes.number,
    currentCurrency: PropTypes.string,
    editTransaction: PropTypes.func,
    ethTransactionAmount: PropTypes.string,
    ethTransactionFee: PropTypes.string,
    ethTransactionTotal: PropTypes.string,
    fiatTransactionAmount: PropTypes.string,
    fiatTransactionFee: PropTypes.string,
    fiatTransactionTotal: PropTypes.string,
    fromAddress: PropTypes.string,
    fromName: PropTypes.string,
    hexTransactionAmount: PropTypes.string,
    hexTransactionFee: PropTypes.string,
    hexTransactionTotal: PropTypes.string,
    isTxReprice: PropTypes.bool,
    methodData: PropTypes.object,
    nonce: PropTypes.string,
    assetImage: PropTypes.string,
    sendTransaction: PropTypes.func,
    showCustomizeGasModal: PropTypes.func,
    showTransactionConfirmedModal: PropTypes.func,
    showRejectTransactionsConfirmationModal: PropTypes.func,
    toAddress: PropTypes.string,
    tokenData: PropTypes.object,
    tokenProps: PropTypes.object,
    toName: PropTypes.string,
    transactionStatus: PropTypes.string,
    txData: PropTypes.object,
    unapprovedTxCount: PropTypes.number,
    currentNetworkUnapprovedTxs: PropTypes.object,
    updateGasAndCalculate: PropTypes.func,
    customGas: PropTypes.object,
    // Component props
    action: PropTypes.string,
    contentComponent: PropTypes.node,
    dataComponent: PropTypes.node,
    detailsComponent: PropTypes.node,
    errorKey: PropTypes.string,
    errorMessage: PropTypes.string,
    primaryTotalTextOverride: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    secondaryTotalTextOverride: PropTypes.string,
    hideData: PropTypes.bool,
    hideDetails: PropTypes.bool,
    hideSubtitle: PropTypes.bool,
    identiconAddress: PropTypes.string,
    onCancel: PropTypes.func,
    onEdit: PropTypes.func,
    onEditGas: PropTypes.func,
    onSubmit: PropTypes.func,
    setMetaMetricsSendCount: PropTypes.func,
    metaMetricsSendCount: PropTypes.number,
    subtitle: PropTypes.string,
    subtitleComponent: PropTypes.node,
    summaryComponent: PropTypes.node,
    title: PropTypes.string,
    titleComponent: PropTypes.node,
    valid: PropTypes.bool,
    warning: PropTypes.string,
    advancedInlineGasShown: PropTypes.bool,
    insufficientBalance: PropTypes.bool,
    hideFiatConversion: PropTypes.bool,
  }

  state = {
    submitting: false,
    submitError: null,
  }

  componentDidUpdate () {
    const {
      transactionStatus,
      showTransactionConfirmedModal,
      history,
      clearConfirmTransaction,
    } = this.props

    if (transactionStatus === DROPPED_STATUS || transactionStatus === CONFIRMED_STATUS) {
      showTransactionConfirmedModal({
        onSubmit: () => {
          clearConfirmTransaction()
          history.push(DEFAULT_ROUTE)
        },
      })

      return
    }
  }

  getErrorKey () {
    const {
      balance,
      conversionRate,
      hexTransactionFee,
      txData: {
        simulationFails,
        txParams: {
          value: amount,
        } = {},
      } = {},
    } = this.props

    const insufficientBalance = balance && !isBalanceSufficient({
      amount,
      gasTotal: hexTransactionFee || '0x0',
      balance,
      conversionRate,
    })

    if (insufficientBalance) {
      return {
        valid: false,
        errorKey: INSUFFICIENT_FUNDS_ERROR_KEY,
      }
    }

    if (simulationFails) {
      return {
        valid: true,
        errorKey: simulationFails.errorKey ? simulationFails.errorKey : TRANSACTION_ERROR_KEY,
      }
    }

    return {
      valid: true,
    }
  }

  handleEditGas () {
    const { onEditGas, showCustomizeGasModal, action, txData: { origin }, methodData = {} } = this.props

    this.context.metricsEvent({
      eventOpts: {
        category: 'Transactions',
        action: 'Confirm Screen',
        name: 'User clicks "Edit" on gas',
      },
      customVariables: {
        recipientKnown: null,
        functionType: action || getMethodName(methodData.name) || this.context.t('contractInteraction'),
        origin,
      },
    })

    if (onEditGas) {
      onEditGas()
    } else {
      showCustomizeGasModal()
    }
  }

  renderDetails () {
    const {
      detailsComponent,
      primaryTotalTextOverride,
      secondaryTotalTextOverride,
      hexTransactionFee,
      hexTransactionTotal,
      hideDetails,
      advancedInlineGasShown,
      customGas,
      insufficientBalance,
      updateGasAndCalculate,
      hideFiatConversion,
    } = this.props

    if (hideDetails) {
      return null
    }

    return (
      detailsComponent || (
        <div className="confirm-page-container-content__details">
          <div className="confirm-page-container-content__gas-fee">
            <ConfirmDetailRow
              label="Gas Fee"
              value={hexTransactionFee}
              headerText="Edit"
              headerTextClassName="confirm-detail-row__header-text--edit"
              onHeaderClick={() => this.handleEditGas()}
              secondaryText={hideFiatConversion ? this.context.t('noConversionRateAvailable') : ''}
            />
            {advancedInlineGasShown
              ? <AdvancedGasInputs
                updateCustomGasPrice={newGasPrice => updateGasAndCalculate({ ...customGas, gasPrice: newGasPrice })}
                updateCustomGasLimit={newGasLimit => updateGasAndCalculate({ ...customGas, gasLimit: newGasLimit })}
                customGasPrice={customGas.gasPrice}
                customGasLimit={customGas.gasLimit}
                insufficientBalance={insufficientBalance}
                customPriceIsSafe={true}
                isSpeedUp={false}
              />
              : null
            }
          </div>
          <div>
            <ConfirmDetailRow
              label="Total"
              value={hexTransactionTotal}
              primaryText={primaryTotalTextOverride}
              secondaryText={hideFiatConversion ? this.context.t('noConversionRateAvailable') : secondaryTotalTextOverride}
              headerText="Amount + Gas Fee"
              headerTextClassName="confirm-detail-row__header-text--total"
              primaryValueTextColor="#2f9ae0"
            />
          </div>
        </div>
      )
    )
  }

  renderData () {
    const { t } = this.context
    const {
      txData: {
        txParams: {
          data,
        } = {},
      } = {},
      methodData: {
        name,
        params,
      } = {},
      hideData,
      dataComponent,
    } = this.props

    if (hideData) {
      return null
    }

    return dataComponent || (
      <div className="confirm-page-container-content__data">
        <div className="confirm-page-container-content__data-box-label">
          {`${t('functionType')}:`}
          <span className="confirm-page-container-content__function-type">
            { name || t('notFound') }
          </span>
        </div>
        {
          params && (
            <div className="confirm-page-container-content__data-box">
              <div className="confirm-page-container-content__data-field-label">
                { `${t('parameters')}:` }
              </div>
              <div>
                <pre>{ JSON.stringify(params, null, 2) }</pre>
              </div>
            </div>
          )
        }
        <div className="confirm-page-container-content__data-box-label">
          {`${t('hexData')}: ${ethUtil.toBuffer(data).length} bytes`}
        </div>
        <div className="confirm-page-container-content__data-box">
          { data }
        </div>
      </div>
    )
  }

  handleEdit () {
    const { txData, tokenData, tokenProps, onEdit, action, txData: { origin }, methodData = {} } = this.props

    this.context.metricsEvent({
      eventOpts: {
        category: 'Transactions',
        action: 'Confirm Screen',
        name: 'Edit Transaction',
      },
      customVariables: {
        recipientKnown: null,
        functionType: action || getMethodName(methodData.name) || this.context.t('contractInteraction'),
        origin,
      },
    })

    onEdit({ txData, tokenData, tokenProps })
  }

  handleCancelAll () {
    const {
      cancelAllTransactions,
      clearConfirmTransaction,
      history,
      showRejectTransactionsConfirmationModal,
      unapprovedTxCount,
    } = this.props

    showRejectTransactionsConfirmationModal({
      unapprovedTxCount,
      async onSubmit () {
        await cancelAllTransactions()
        clearConfirmTransaction()
        history.push(DEFAULT_ROUTE)
      },
    })
  }

  handleCancel () {
    const { metricsEvent } = this.context
    const { onCancel, txData, cancelTransaction, history, clearConfirmTransaction, action, txData: { origin }, methodData = {} } = this.props

    if (onCancel) {
      metricsEvent({
        eventOpts: {
          category: 'Transactions',
          action: 'Confirm Screen',
          name: 'Cancel',
        },
        customVariables: {
          recipientKnown: null,
          functionType: action || getMethodName(methodData.name) || this.context.t('contractInteraction'),
          origin,
        },
      })
      onCancel(txData)
    } else {
      cancelTransaction(txData)
        .then(() => {
          clearConfirmTransaction()
          history.push(DEFAULT_ROUTE)
        })
    }
  }

  handleSubmit () {
    const { metricsEvent } = this.context
    const { txData: { origin }, sendTransaction, clearConfirmTransaction, txData, history, onSubmit, action, metaMetricsSendCount = 0, setMetaMetricsSendCount, methodData = {} } = this.props
    const { submitting } = this.state

    if (submitting) {
      return
    }

    this.setState({
      submitting: true,
      submitError: null,
    }, () => {
      metricsEvent({
        eventOpts: {
          category: 'Transactions',
          action: 'Confirm Screen',
          name: 'Transaction Completed',
        },
        customVariables: {
          recipientKnown: null,
          functionType: action || getMethodName(methodData.name) || this.context.t('contractInteraction'),
          origin,
        },
      })

      setMetaMetricsSendCount(metaMetricsSendCount + 1)
        .then(() => {
          if (onSubmit) {
            Promise.resolve(onSubmit(txData))
              .then(() => {
                this.setState({
                  submitting: false,
                })
              })
          } else {
            sendTransaction(txData)
              .then(() => {
                clearConfirmTransaction()
                this.setState({
                  submitting: false,
                }, () => {
                  history.push(DEFAULT_ROUTE)
                })
              })
              .catch(error => {
                this.setState({
                  submitting: false,
                  submitError: error.message,
                })
              })
          }
        })
    })
  }

  renderTitleComponent () {
    const { title, titleComponent, hexTransactionAmount } = this.props

    // Title string passed in by props takes priority
    if (title) {
      return null
    }

    return titleComponent || (
      <UserPreferencedCurrencyDisplay
        value={hexTransactionAmount}
        type={PRIMARY}
        showEthLogo
        ethLogoHeight="26"
        hideLabel
      />
    )
  }

  renderSubtitleComponent () {
    const { subtitle, subtitleComponent, hexTransactionAmount } = this.props

    // Subtitle string passed in by props takes priority
    if (subtitle) {
      return null
    }

    return subtitleComponent || (
      <UserPreferencedCurrencyDisplay
        value={hexTransactionAmount}
        type={SECONDARY}
        showEthLogo
        hideLabel
      />
    )
  }

  handleNextTx (txId) {
    const { history, clearConfirmTransaction } = this.props
    if (txId) {
      clearConfirmTransaction()
      history.push(`${CONFIRM_TRANSACTION_ROUTE}/${txId}`)
    }
  }

  getNavigateTxData () {
    const { currentNetworkUnapprovedTxs, txData: { id } = {} } = this.props
    const enumUnapprovedTxs = Object.keys(currentNetworkUnapprovedTxs).reverse()
    const currentPosition = enumUnapprovedTxs.indexOf(id.toString())

    return {
      totalTx: enumUnapprovedTxs.length,
      positionOfCurrentTx: currentPosition + 1,
      nextTxId: enumUnapprovedTxs[currentPosition + 1],
      prevTxId: enumUnapprovedTxs[currentPosition - 1],
      showNavigation: enumUnapprovedTxs.length > 1,
      firstTx: enumUnapprovedTxs[0],
      lastTx: enumUnapprovedTxs[enumUnapprovedTxs.length - 1],
      ofText: this.context.t('ofTextNofM'),
      requestsWaitingText: this.context.t('requestsAwaitingAcknowledgement'),
    }
  }

  componentDidMount () {
    const { txData: { origin } = {} } = this.props
    const { metricsEvent } = this.context
    metricsEvent({
      eventOpts: {
        category: 'Transactions',
        action: 'Confirm Screen',
        name: 'Confirm: Started',
      },
      customVariables: {
        origin,
      },
    })
  }

  render () {
    const {
      isTxReprice,
      fromName,
      fromAddress,
      toName,
      toAddress,
      methodData,
      valid: propsValid = true,
      errorMessage,
      errorKey: propsErrorKey,
      action,
      title,
      subtitle,
      hideSubtitle,
      identiconAddress,
      summaryComponent,
      contentComponent,
      onEdit,
      nonce,
      assetImage,
      warning,
      unapprovedTxCount,
    } = this.props
    const { submitting, submitError } = this.state

    const { name } = methodData
    const { valid, errorKey } = this.getErrorKey()
    const { totalTx, positionOfCurrentTx, nextTxId, prevTxId, showNavigation, firstTx, lastTx, ofText, requestsWaitingText } = this.getNavigateTxData()

    return (
      <ConfirmPageContainer
        fromName={fromName}
        fromAddress={fromAddress}
        toName={toName}
        toAddress={toAddress}
        showEdit={onEdit && !isTxReprice}
        action={action || getMethodName(name) || this.context.t('contractInteraction')}
        title={title}
        titleComponent={this.renderTitleComponent()}
        subtitle={subtitle}
        subtitleComponent={this.renderSubtitleComponent()}
        hideSubtitle={hideSubtitle}
        summaryComponent={summaryComponent}
        detailsComponent={this.renderDetails()}
        dataComponent={this.renderData()}
        contentComponent={contentComponent}
        nonce={nonce}
        unapprovedTxCount={unapprovedTxCount}
        assetImage={assetImage}
        identiconAddress={identiconAddress}
        errorMessage={errorMessage || submitError}
        errorKey={propsErrorKey || errorKey}
        warning={warning}
        totalTx={totalTx}
        positionOfCurrentTx={positionOfCurrentTx}
        nextTxId={nextTxId}
        prevTxId={prevTxId}
        showNavigation={showNavigation}
        onNextTx={(txId) => this.handleNextTx(txId)}
        firstTx={firstTx}
        lastTx={lastTx}
        ofText={ofText}
        requestsWaitingText={requestsWaitingText}
        disabled={!propsValid || !valid || submitting}
        onEdit={() => this.handleEdit()}
        onCancelAll={() => this.handleCancelAll()}
        onCancel={() => this.handleCancel()}
        onSubmit={() => this.handleSubmit()}
      />
    )
  }
}

export function getMethodName (camelCase) {
  if (!camelCase || typeof camelCase !== 'string') {
    return ''
  }

  return camelCase
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z])([a-z])/g, ' $1$2')
    .replace(/ +/g, ' ')
}
