import React from 'react'

const Dashboard = React.lazy(() => import('./views/Dashboard'))
const SystemStatus = React.lazy(() => import('./views/SystemStatus'))
const RoleManagement = React.lazy(() => import('./components/RoleManagement/RoleTable'))
const Users = React.lazy(() => import('./components/Users/UserTable'))
const ActivityCalendar = React.lazy(() => import('./components/ActivityCalendar/BigCalendar'))
const AdminAbsenceRequestTable = React.lazy(() => import('./components/AbsenceManagement/AdminAbsenceRequestTable'))
const UserAbsenceRequestTable = React.lazy(() => import('./components/AbsenceManagement/UserAbsenceRequestTable'))
const UserAbsenceAccuralTable = React.lazy(() => import('./components/AbsenceManagement/UserAbsenceAccuralTable'))

const routes = [
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/role-management', name: 'Role Management', element: RoleManagement },
  { path: '/users', name: 'Users', element: Users },
  { path: '/activity-calendar', name: 'Activity Calendar', element: ActivityCalendar },
  { path: '/absence-management', name: 'Absence Management', element: UserAbsenceAccuralTable },
  { path: '/absence-management/requests/admin', name: 'Absence Requests', element: AdminAbsenceRequestTable },
  { path: '/absence-management/requests/user', name: 'My Absence Requests', element: UserAbsenceRequestTable },
  { path: '/absence-management/accurals/user', name: 'My Accurals', element: UserAbsenceAccuralTable },
  { path: '/system-status', name: 'System Status', element: SystemStatus },
]

export default routes
