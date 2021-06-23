import {
  INITIALIZE_CREATE_PASSWORD_ROUTE,
  INITIALIZE_IMPORT_WITH_SECRET,
  DEFAULT_ROUTE,
} from '../../../routes'

const selectors = {
  getFirstTimeFlowTypeRoute,
}

module.exports = selectors

function getFirstTimeFlowTypeRoute (state) {
  const { firstTimeFlowType } = state.metamask

  let nextRoute
  if (firstTimeFlowType === 'create') {
    nextRoute = INITIALIZE_CREATE_PASSWORD_ROUTE
  } else if (firstTimeFlowType === 'import') {
    nextRoute = INITIALIZE_IMPORT_WITH_SECRET
  } else {
    nextRoute = DEFAULT_ROUTE
  }

  return nextRoute
}
