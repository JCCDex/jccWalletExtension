import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

/**
 * 不同链 钱包的密钥备份界面共通，通过父组件 keypairs 和 nextRoute 实现信息显示和页面跳转逻辑
 * 后期可以通过添加 备份选项 的 type 来实现多种类型的 钱包密钥的备份。
 */
export default class WalltBackup extends PureComponent {
  static contextTypes = {
    metricsEvent: PropTypes.func,
    t: PropTypes.func,
  }

  static propTypes = {
    history: PropTypes.object.isRequired,
    keypairs: PropTypes.object,
    nextRoute:PropTypes.string,
  }

  state = {
    password: '',
    confirmPassword: '',
    passwordError: '',
    confirmPasswordError: '',
  }

  render () {
    const { t } = this.context
    const {keypairs,nextRoute} = this.props
    return (
      <div>
      <div className = "new-account__Describe">
        <div className = 'new-account__Describe__UseTip'>
          {t('CreactWaleltTips1')}
        </div>
        <div className = 'new-account__Describe__UseTip'>
          {t('FirstUsedTips7')}
        </div>
      </div>

      <div className = 'new-account__Entry'>
          {t('WalletAddress')}
      </div>

      <div className = 'new-account__Show'>
        {keypairs.address}
      </div>

      <div className = 'new-account__Entry'>
          {t('WalletSecret')}
      </div>

      <div className = 'new-account__Show'>
          {keypairs.secret}
      </div>

        <button className ='new-account__button'
          onClick={e => {
            e.preventDefault()
            this.context.metricsEvent({
              eventOpts: {
                category: 'Onboarding',
                action: 'Create Password',
                name: 'Submit Password',
              },
            })
            this.props.history.push(nextRoute)
          }}>
        {t('FirstUsedTips9')}
      </button>


        <div className="first-time-flow__Symbol">
      <img
        className="first-time-flow__Symbol--icon"
        src="/images/emogi.png"
        height={16}
        width={16}
      />
        <div className="first-time-flow__Symbol--font">
          {t('Reminder')}
        </div>
      </div>
    <div className="first-time-flow__Describe">
      <div className="first-time-flow__Star">*</div>
      <div className="first-time-flow__FirstUsedTips2">
      { t('FirstUsedTips4') }
      </div>
    </div>
    <div className="first-time-flow__Describe">
      <div className="first-time-flow__Star">*</div>
      <div className="first-time-flow__FirstUsedTips2">
      { t('FirstUsedTips5') }
      </div>
    </div>
    </div>
    )
  }
}
