import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Button from '../../button'
import {
  INITIALIZE_METAMETRICS_OPT_IN_ROUTE,
  INITIALIZE_CREATE_PASSWORD_ROUTE,
  INITIALIZE_IMPORT_WITH_SECRET,
  DEFAULT_ROUTE,
} from '../../../routes'
export default class SelectAction extends PureComponent {
  static propTypes = {
    history: PropTypes.object,
    isInitialized: PropTypes.bool,
    setFirstTimeFlowType: PropTypes.func,
    nextRoute: PropTypes.string,
    onCreateWalletByType: PropTypes.func,
  }

  static contextTypes = {
    t: PropTypes.func,
  }

  componentDidMount () {
    const { history, isInitialized, nextRoute } = this.props

    if (isInitialized) {
      history.push(nextRoute)
    }
  }

  handleCreate = async () => {
    const {onCreateWalletByType} = this.props
    await onCreateWalletByType ('jingtum');
    this.props.setFirstTimeFlowType('create')
    this.props.history.push(INITIALIZE_CREATE_PASSWORD_ROUTE)
  }

  handleImport = () => {
    this.props.setFirstTimeFlowType('import')
    this.props.history.push(INITIALIZE_IMPORT_WITH_SECRET)
  }

  render () {
    const { t } = this.context
    return (
      <div className='first-time-flow__wrapper'>
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
        <div className="first-time-flow__FirstUsedTips1">
        { t('FirstUsedTips1') }
        </div>
      </div>
      <div className="first-time-flow__Describe">
        <div className="first-time-flow__Star">*</div>
        <div className="first-time-flow__FirstUsedTips2">
       { t('FirstUsedTips2') }
       </div>  
      </div>
      <div className="first-time-flow__Describe">
        <div className="first-time-flow__Star">*</div>
        <div className="first-time-flow__FirstUsedTips2">
       { t('FirstUsedTips3') }
       </div> 
      </div>
      <div className="first-time-flow__Empty"/> 
       <Button
            type="confirm"
            className="first-time-flow__button"
            onClick={this.handleCreate}
          >
            { t('createAWallet') }
          </Button>
       <Button
            type="confirm"
            className="first-time-flow__button"
            onClick={this.handleImport}
          >
            { t('importWallet') }
          </Button>
      </div>
    )
  }
}