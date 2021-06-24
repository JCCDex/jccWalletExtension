import React from 'react'
import PropTypes from 'prop-types'
import { Redirect, Route } from 'react-router-dom'
import { UNLOCK_ROUTE, INITIALIZE_ROUTE } from '../../routes'

export default function Authenticated (props) {
  const { completedOnboarding } = props
  switch (true) {
   // case isUnlocked && completedOnboarding:
   case completedOnboarding:
     console.log("还在 初始化")
      return <Route { ...props } />
    case !completedOnboarding:
      return <Redirect to={{ pathname: INITIALIZE_ROUTE }} />
    default:
      return <Redirect to={{ pathname: UNLOCK_ROUTE }} />
  }
}

Authenticated.propTypes = {
  isUnlocked: PropTypes.bool,
  completedOnboarding: PropTypes.bool,
}
