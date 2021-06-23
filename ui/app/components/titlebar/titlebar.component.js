import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

export default class TitleBar extends Component {

    static contextTypes = {
      history: PropTypes.object,
      }


    render(){
        const {title,history} = this.props
        return (
            <div>
            <div className='title-bar'>
              <img
                className="title-bar__back--icon"
                src="/images/back.png"
                onClick={()=>{history.goBack()}}
                height={16}
                width={10}
              />
              <div className="title-bar__title">
                {title}
              </div>
            </div>
            <hr className='title-bar__title__separator' />
            </div>
        )
    }
}