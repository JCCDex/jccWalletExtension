import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SendRowWrapper from '../send-row-wrapper'
import TextField from '../../../text-field'

export default class SendMemoRow extends Component {
  static propTypes = {
    data: PropTypes.string,
    inError: PropTypes.bool,
    updateMemoData: PropTypes.func.isRequired,
  };

  static contextTypes = {
    t: PropTypes.func,
  };

  state = {
    memo: '',
  }

  updateMemo (memo) {
    const {updateMemoData} = this.props
    updateMemoData(memo)
  }

  handleMemoChange (memo) {
    this.setState({ memo })
  }

  render () {
    const {inError} = this.props
    const {t} = this.context

    return (
      <SendRowWrapper
        label={`${t('memo')}:`}
        showError={inError}
        errorType={'memo'}
      >
       <TextField
              id="memo"
              className="first-time-flow__input"
              value={this.state.memo}
              style={{width:"255px", height:"32px"}}
              onBlur={event => {
                this.updateMemo(event.target.value)
              }}
              onChange={event => this.handleMemoChange(event.target.value)}
              margin="normal"
              largeLabel
            />
      </SendRowWrapper>
    )
  }
}
