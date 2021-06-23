import { connect } from 'react-redux'
import { compose } from 'recompose'
import { withRouter } from 'react-router-dom'
const actions = require('../../actions')
import TitleBar from './titlebar.component'

function mapStateToProps (state) {
    const { } = state
    return {
    }
  }

  function mapDispatchToProps (dispatch) {
    return {
    }
  }

export default compose(
    withRouter,
    connect(mapStateToProps,mapDispatchToProps)
)(TitleBar)    