import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
export default class AccountNameChange extends PureComponent {

    static contextTypes = {
        t: PropTypes.func,
        metricsEvent: PropTypes.func,
      }

    render(){
        const { t } = this.context
        return(
            <div >
                {12324356565}
            </div>
        )
    }
}