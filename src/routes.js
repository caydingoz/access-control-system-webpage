import React from 'react'

const Dashboard = React.lazy(() => import('./views/Dashboard'))
const RoleManagement = React.lazy(() => import('./views/RoleManagement'))
const Users = React.lazy(() => import('./views/Users'))
const ActivityCalendar = React.lazy(() => import('./views/ActivityCalendar'))
const SystemStatus = React.lazy(() => import('./views/SystemStatus'))

const routes = [
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/role-management', name: 'RoleManagement', element: RoleManagement },
  { path: '/users', name: 'Users', element: Users },
  { path: '/activity-calendar', name: 'ActivityCalendar', element: ActivityCalendar },
  { path: '/system-status', name: 'SystemStatus', element: SystemStatus },
]

export default routes
