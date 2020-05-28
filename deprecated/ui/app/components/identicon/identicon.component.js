import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Jazzicon from '../jazzicon'

const getStyles = diameter => (
  {
    height: diameter,
    width: diameter,
    borderRadius: diameter / 2,
  }
)

export default class Identicon extends PureComponent {
  static propTypes = {
    address: PropTypes.string,
    className: PropTypes.string,
    diameter: PropTypes.number,
    image: PropTypes.string,
    useBlockie: PropTypes.bool,
  }

  static defaultProps = {
    diameter: 46,
  }

  renderImage () {
    const { className, diameter, image } = this.props

    return (
      <img
        className={classnames('identicon', className)}
        src={image}
        style={getStyles(diameter)}
      />
    )
  }

  renderJazzicon () {
    const { address, className, diameter } = this.props

    return (
      <Jazzicon
        address={address}
        diameter={diameter}
        className={classnames('identicon', className)}
        style={getStyles(diameter)}
      />
    )
  }


  render () {
    const { className, address, image, diameter } = this.props

    if (image) {
      return this.renderImage()
    }

    if (address) {
      return this.renderJazzicon()
    }

    return (
      <img
        className={classnames('balance-icon', className)}
        src="./images/swtc.png"
        style={getStyles(diameter)}
      />
    )
  }
}
