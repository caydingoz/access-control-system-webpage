import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const RoleManagement = React.lazy(() => import('./views/role-management/RoleManagement'))
const Users = React.lazy(() => import('./views/users/Users'))
const SystemStatus = React.lazy(() => import('./views/system-status/SystemStatus'))

const routes = [
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/role-management', name: 'RoleManagement', element: RoleManagement },
  { path: '/users', name: 'Users', element: Users },
  { path: '/system-status', name: 'SystemStatus', element: SystemStatus },
]

export default routes
