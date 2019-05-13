import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PageContainerFooter from '../../page-container/page-container-footer'

export default class MetaMetricsOptInModal extends Component {
  static propTypes = {
    setParticipateInMetaMetrics: PropTypes.func,
    hideModal: PropTypes.func,
  }

  static contextTypes = {
    metricsEvent: PropTypes.func,
  }

  render () {
    const { metricsEvent } = this.context
    const { setParticipateInMetaMetrics, hideModal } = this.props

    return (
      <div className="metametrics-opt-in metametrics-opt-in-modal">
        <div className="metametrics-opt-in__main">
          <div className="metametrics-opt-in__content">
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
          </div>
          <div className="metametrics-opt-in__footer">
            <PageContainerFooter
              onCancel={() => {
                setParticipateInMetaMetrics(false)
                  .then(() => {
                    metricsEvent({
                      eventOpts: {
                        category: 'Onboarding',
                        action: 'Metrics Option',
                        name: 'Metrics Opt Out',
                      },
                      isOptIn: true,
                    }, {
                      excludeMetaMetricsId: true,
                    })
                    hideModal()
                  })
              }}
              cancelText={'No Thanks'}
              hideCancel={false}
              onSubmit={() => {
                setParticipateInMetaMetrics(true)
                  .then(() => {
                    metricsEvent({
                      eventOpts: {
                        category: 'Onboarding',
                        action: 'Metrics Option',
                        name: 'Metrics Opt In',
                      },
                      isOptIn: true,
                    })
                    hideModal()
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
