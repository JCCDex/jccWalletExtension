import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PageContainerFooter from '../../../page-container/page-container-footer'

export default class MetaMetricsOptIn extends Component {
  static propTypes = {
    history: PropTypes.object,
    setParticipateInMetaMetrics: PropTypes.func,
    nextRoute: PropTypes.string,
    firstTimeSelectionMetaMetricsName: PropTypes.string,
    participateInMetaMetrics: PropTypes.bool,
  }

  static contextTypes = {
    metricsEvent: PropTypes.func,
  }

  render () {
    const { metricsEvent } = this.context
    const {
      nextRoute,
      history,
      setParticipateInMetaMetrics,
      firstTimeSelectionMetaMetricsName,
      participateInMetaMetrics,
    } = this.props

    return (
      <div className="metametrics-opt-in">
        <div className="metametrics-opt-in__main">
          <div className="app-header__logo-container">
            <img
              className="app-header__metafox-logo app-header__metafox-logo--horizontal"
              src="/images/logo/swtclogo.png"
             // width={163}
              height={30}
            />
            <img
              className="app-header__metafox-logo app-header__metafox-logo--icon"
              src="/images/logo/jingtum.png"
              height={42}
              width={42}
            />
          </div>
          <div className="metametrics-opt-in__body-graphic">
            <img src="images/metrics-chart.svg" />
          </div>
          <div className="metametrics-opt-in__body">
            <div className="metametrics-opt-in__description">
             JingtumMask will..
            </div>

            <div className="metametrics-opt-in__committments">
              <div className="metametrics-opt-in__row metametrics-opt-in__break-row">
                <i className="fa fa-times" />
                <div className="metametrics-opt-in__row-description">
                  <span className="metametrics-opt-in__bold">Never</span> collect keys, addresses, transactions, balances, hashes, or any personal information
                </div>
              </div>
              <div className="metametrics-opt-in__row">
                <i className="fa fa-times" />
                <div className="metametrics-opt-in__row-description">
                  <span className="metametrics-opt-in__bold">Never</span> collect your full IP address
                </div>
              </div>
              <div className="metametrics-opt-in__row">
                <i className="fa fa-times" />
                <div className="metametrics-opt-in__row-description">
                  <span className="metametrics-opt-in__bold">Never</span> sell data for profit. Ever!
                </div>
              </div>
            </div>
          </div>
          <div className="metametrics-opt-in__footer">
            <PageContainerFooter
              onCancel={() => {
                setParticipateInMetaMetrics(false)
                  .then(() => {
                    const promise = participateInMetaMetrics !== false
                      ? metricsEvent({
                        eventOpts: {
                          category: 'Onboarding',
                          action: 'Metrics Option',
                          name: 'Metrics Opt Out',
                        },
                        isOptIn: true,
                      })
                      : Promise.resolve()

                    promise
                      .then(() => {
                        history.push(nextRoute)
                      })
                })
              }}
              cancelText={'No Thanks'}
              hideCancel={false}
              onSubmit={() => {
                setParticipateInMetaMetrics(true)
                  .then(([participateStatus, metaMetricsId]) => {
                    const promise = participateInMetaMetrics !== true
                      ? metricsEvent({
                        eventOpts: {
                          category: 'Onboarding',
                          action: 'Metrics Option',
                          name: 'Metrics Opt In',
                        },
                        isOptIn: true,
                      })
                      : Promise.resolve()

                    promise
                      .then(() => {
                        return metricsEvent({
                          eventOpts: {
                            category: 'Onboarding',
                            action: 'Import or Create',
                            name: firstTimeSelectionMetaMetricsName,
                          },
                          isOptIn: true,
                          metaMetricsId,
                        })
                      })
                      .then(() => {
                        history.push(nextRoute)
                      })
                })
              }}
              submitText={'I agree'}
              submitButtonType={'confirm'}
              disabled={false}
            />
          </div>
        </div>
      </div>
    )
  }
}
