import { connect } from 'react-redux'
import { compose } from 'recompose'
import { withRouter } from 'react-router-dom'
import ConfirmTransaction from './confirm-transaction.component'

const mapStateToProps = state => {
  const { metamask: { send }, confirmTransaction } = state
  return {
    send,
    confirmTransaction,
  }
}


export default compose(
  withRouter,
  connect(mapStateToProps)
)(ConfirmTransaction)
