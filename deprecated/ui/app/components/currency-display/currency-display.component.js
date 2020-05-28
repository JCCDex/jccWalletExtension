import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

export default class CurrencyDisplay extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    displayValue: PropTypes.string,
    prefix: PropTypes.string,
    prefixComponent: PropTypes.node,
    style: PropTypes.object,
    suffix: PropTypes.string,
    address: PropTypes.string,
    // Used in container
    currency: PropTypes.string,
    value: PropTypes.string,
    numberOfDecimals: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    hideLabel: PropTypes.bool,
    hideTitle: PropTypes.bool,
  }

  render () {
    const { className, displayValue, prefix, prefixComponent, style, suffix, hideTitle } = this.props

    const text = `${prefix || ''}${displayValue}`
    const title = `${text} ${suffix}`
   
    return (
      <div
        className={classnames('currency-display-component', className)}
        style={style}
        title={!hideTitle && title || null}
      >
        { prefixComponent }
        <span style={{fontSize: 'smaller'}}>{ text }</span>
        {
          suffix && (
            <span style={{fontSize: 'smaller'}}>
              SWTC
            </span>
          )
        }
      </div>
    )
  }
}
