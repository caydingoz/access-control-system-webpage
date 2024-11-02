import React from 'react'

const Dashboard = React.lazy(() => import('./views/Dashboard'))
const SystemStatus = React.lazy(() => import('./views/SystemStatus'))
const RoleManagement = React.lazy(() => import('./components/RoleManagement/RoleTable'))
const Users = React.lazy(() => import('./components/Users/UserTable'))
const ActivityCalendar = React.lazy(() => import('./components/Calendar/BigCalendar'))
const AbsenceRequestTable = React.lazy(() => import('./components/AbsenceManagement/AbsenceRequestTable'))
const MyAbsenceRequestTable = React.lazy(() => import('./components/AbsenceManagement/MyAbsenceRequestTable'))

const routes = [
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/role-management', name: 'Role Management', element: RoleManagement },
  { path: '/users', name: 'Users', element: Users },
  { path: '/activity-calendar', name: 'Activity Calendar', element: ActivityCalendar },
  { path: '/absence-management', name: 'Absence Management' },
  { path: '/absence-management/all', name: 'Absence Requests', element: AbsenceRequestTable },
  { path: '/absence-management/user', name: 'My Absence Requests', element: MyAbsenceRequestTable },
  { path: '/system-status', name: 'System Status', element: SystemStatus },
]

export default routes
