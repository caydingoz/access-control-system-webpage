import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const RoleManagement = React.lazy(() => import('./views/role-management/RoleManagement'))

const routes = [
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/role-management', name: 'RoleManagement', element: RoleManagement },
]

export default routes
