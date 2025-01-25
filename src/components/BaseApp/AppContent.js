import React, { Suspense, useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CSpinner } from '@coreui/react'
import { PermissionRoute } from '../Auth/PermissionRoute'
import { PermissionTypes } from '../../enums/PermissionTypes'
import routes from '../../routes'
import { fetchUserPermissions } from '../../redux/slices/authSlice'
import { useDispatch, useSelector } from 'react-redux'

const Page404 = React.lazy(() => import('../../views/errors/Page404'))
const Page401 = React.lazy(() => import('../../views/errors/Page401'))

const AppContent = () => {
  const dispatch = useDispatch()
  const { loading, tokenInfo } = useSelector((state) => state.auth)

  useEffect(() => {
    if (tokenInfo) {
      dispatch(fetchUserPermissions())
    }
  }, [dispatch, tokenInfo])

  if (loading) {
    return (
      <div className="loading-container">
        <CSpinner color="primary" />
      </div>
    )
  }

  return (
    <Suspense fallback={<CSpinner color="primary" />}>
      <Routes>
        {routes.map((route, idx) => {
          return (
            route.element && (
              <Route
                key={idx}
                path={route.path}
                element={
                  <PermissionRoute entity={route.permissionName} action={PermissionTypes.Read}>
                    <route.element />
                  </PermissionRoute>
                }
              />
            )
          )
        })}
        <Route path="/unauthorized" name="Page 401" element={<Page401 />} />
        <Route path="/" element={<Navigate to="dashboard" replace />} />
        <Route path="*" name="Page 404" element={<Page404 />} />
      </Routes>
    </Suspense>
  )
}

export default React.memo(AppContent)
