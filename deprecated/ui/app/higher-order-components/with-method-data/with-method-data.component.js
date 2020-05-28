import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

export default function withMethodData (WrappedComponent) {
  return class MethodDataWrappedComponent extends PureComponent {
    static propTypes = {
      transaction: PropTypes.object,
      knownMethodData: PropTypes.object,
      addKnownMethodData: PropTypes.func,
    }

    static defaultProps = {
      transaction: {},
      knownMethodData: {},
    }

    state = {
      methodData: {},
      done: false,
      error: null,
    }


    render () {
      const { methodData, done, error } = this.state

      return (
        <WrappedComponent
          { ...this.props }
          methodData={{ data: methodData, done, error }}
        />
      )
    }
  }
}
