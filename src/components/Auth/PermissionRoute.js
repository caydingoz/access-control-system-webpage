import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { selectHasPermission } from '../../redux/selectors/authSelector'

export const PermissionRoute = ({ entity, action, children }) => {
  const hasPermission = useSelector(selectHasPermission(entity, action))

  if (!hasPermission) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}
