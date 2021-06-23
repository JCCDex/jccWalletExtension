import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class InputPrompt extends Component {
  static contextTypes = {
    t: PropTypes.func,
  }

  static propTypes = {
    massage: PropTypes.string,
    isShowing: PropTypes.bool,
  }


  render () {
    const { massage, isShowing } = this.props
    const { t }= this.context;
    return (      
      <div className="input-prompt__tip">
        {          
          isShowing?
            <div className="input-prompt__tip__font">
            {massage}
            </div> : null

        }
      </div>
    )
  }
}
