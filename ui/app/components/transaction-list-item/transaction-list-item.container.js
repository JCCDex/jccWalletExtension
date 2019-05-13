import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import withMethodData from '../../higher-order-components/with-method-data'
import TransactionListItem from './transaction-list-item.component'

const mapStateToProps = state => {
  const { metamask: { knownMethodData } } = state

  return {
    knownMethodData,
  }
}

const mergeProps = (stateProps, ownProps) => {
  const { transaction } = ownProps

  return {
    ...stateProps,
    ...ownProps,
    transaction,
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mergeProps),
  withMethodData,
)(TransactionListItem)
