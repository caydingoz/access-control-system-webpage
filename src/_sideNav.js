import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilBarChart, cilBook, cilDescription, cilStar, cilGroup, cilCalendar, cilMonitor, cilShieldAlt } from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _sideNav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilBarChart} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
    permissionName: 'Dashboard',
  },
  {
    component: CNavItem,
    name: 'Role Management',
    to: '/role-management',
    icon: <CIcon icon={cilShieldAlt} customClassName="nav-icon" />,
    permissionName: 'Role',
  },
  {
    component: CNavItem,
    name: 'Users',
    to: '/users',
    icon: <CIcon icon={cilGroup} customClassName="nav-icon" />,
    permissionName: 'User',
  },
  {
    component: CNavItem,
    name: 'Activity Calendar',
    to: '/activity-calendar',
    icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
    permissionName: 'Activity',
  },
  {
    component: CNavGroup,
    name: 'Absence Management',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
    to: '/absence-management/user/accurals',
    permissionName: 'Absence',
    items: [
      {
        component: CNavItem,
        name: 'Absence Requests',
        to: '/absence-management/requests/admin',
        permissionName: 'AbsenceAdmin',
      },
      {
        component: CNavItem,
        name: 'My Accurals',
        to: '/absence-management/accurals/user',
        permissionName: 'Absence',
      },
      {
        component: CNavItem,
        name: 'My Absence Requests',
        to: '/absence-management/requests/user',
        permissionName: 'Absence',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'System Status',
    to: '/system-status',
    icon: <CIcon icon={cilMonitor} customClassName="nav-icon" />,
    permissionName: 'SystemOperations',
  },
  {
    component: CNavTitle,
    name: 'Extras',
    permissionName: 'Test',
  },
  {
    component: CNavGroup,
    name: 'Pages',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    permissionName: 'Test',
    items: [
      {
        component: CNavItem,
        name: 'Login',
        to: '/login',
        permissionName: 'Test',
      },
      {
        component: CNavItem,
        name: 'Register',
        to: '/register',
        permissionName: 'Test',
      },
      {
        component: CNavItem,
        name: 'Error 401',
        to: '/unauthorized',
        permissionName: 'Test',
      },
      {
        component: CNavItem,
        name: 'Error 404',
        to: '/404',
        permissionName: 'Test',
      },
      {
        component: CNavItem,
        name: 'Error 500',
        to: '/500',
        permissionName: 'Test',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'ToDocs',
    href: 'https://coreui.io/react/docs/templates/installation/',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
    permissionName: 'Test',
  },
]

export default _sideNav
