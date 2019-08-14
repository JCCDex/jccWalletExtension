import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PageContainerFooter from '../../page-container/page-container-footer'

export default class MetaMetricsOptInModal extends Component {
  static propTypes = {
    hideModal: PropTypes.func,
  }

  static contextTypes = {
    metricsEvent: PropTypes.func,
    t: PropTypes.func,
  }

  render () {
    const { metricsEvent } = this.context
    const { hideModal } = this.props
    const {t} = this.context

    return (
      <div className="metametrics-opt-in metametrics-opt-in-modal">
        <div className="metametrics-opt-in__main">
          <div className="metametrics-opt-in__content">
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
            <div className="metametrics-opt-in__body-graphic">
              <img src="images/metrics-chart.svg" />
            </div>
            <div className="metametrics-opt-in__body">
             
              <div className="metametrics-opt-in__description">
                {t('jingtummask_will')}
              </div>

              <div className="metametrics-opt-in__committments">
                <div className="metametrics-opt-in__row metametrics-opt-in__break-row">
                  <i className="fa fa-times" />
                  <div className="metametrics-opt-in__row-description">
                    <span className="metametrics-opt-in__bold">{t('never')}</span> {t('never1')}
                  </div>
                </div>
                <div className="metametrics-opt-in__row">
                  <i className="fa fa-times" />
                  <div className="metametrics-opt-in__row-description">
                    <span className="metametrics-opt-in__bold">{t('never')}</span> {t('never2')}
                  </div>
                </div>
                <div className="metametrics-opt-in__row">
                  <i className="fa fa-times" />
                  <div className="metametrics-opt-in__row-description">
                    <span className="metametrics-opt-in__bold">{t('never')}</span> {t('never3')}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="metametrics-opt-in__footer">
            <PageContainerFooter
              onCancel={() => {
                hideModal()
              }}
              cancelText={'No Thanks'}
              hideCancel={false}
              onSubmit={() => {
                hideModal()
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
