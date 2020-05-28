import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import TransactionList from './transaction-list.component'
import { getSelectedAddress, getAssetImages } from '../../selectors'

const mapStateToProps = state => {
  return {
    selectedAddress: getSelectedAddress(state),
    assetImages: getAssetImages(state),
  }
}

const mapDispatchToProps = dispatch => {
  return {
   // updateNetworkNonce: address => dispatch(updateNetworkNonce(address)),
  }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { ...restStateProps } = stateProps
  const { ...restDispatchProps } = dispatchProps

  return {
    ...restStateProps,
    ...restDispatchProps,
    ...ownProps,
   // updateNetworkNonce: () => updateNetworkNonce(selectedAddress),
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps, mergeProps)
)(TransactionList)
