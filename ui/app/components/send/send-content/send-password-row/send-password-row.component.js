import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SendRowWrapper from '../send-row-wrapper'
import TextField from '../../../text-field'

export default class SendPasswordRow extends Component {
  static propTypes = {
    data: PropTypes.string,
    inError: PropTypes.bool,
    updateSendHexData: PropTypes.func.isRequired,
  };

  static contextTypes = {
    t: PropTypes.func,
  };

  state = {
    password: '',
  }

  updatePassword (password) {
    const {updateSendHexData} = this.props
    updateSendHexData(password)
  }

  handlePasswordChange (password) {
    this.setState({ password })
  }

  render () {
    const {inError} = this.props
    const {t} = this.context

    return (
      <SendRowWrapper
        label={`${t('password')}:`}
        showError={inError}
        errorType={'amount'}
      >
       <TextField
              id="password"
              type="password"
              style={{margin:"0 auto", width:"100%", height:"32px"}}
              className="first-time-flow__input"
              value={this.state.password}
              onBlur={event => {
                this.updatePassword(event.target.value)
              }}
              onChange={event => this.handlePasswordChange(event.target.value)}
              autoComplete="new-password"
              margin="normal"
              largeLabel
            />
      </SendRowWrapper>
    )
  }
}
