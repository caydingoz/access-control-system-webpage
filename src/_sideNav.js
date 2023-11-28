import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilBarChart, cilBook, cilDescription, cilStar } from '@coreui/icons'
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
  },
  {
    component: CNavItem,
    name: 'Role Management',
    to: '/role-management',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Extras',
  },
  {
    component: CNavGroup,
    name: 'Pages',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Login',
        to: '/login',
      },
      {
        component: CNavItem,
        name: 'Register',
        to: '/register',
      },
      {
        component: CNavItem,
        name: 'Error 404',
        to: '/404',
      },
      {
        component: CNavItem,
        name: 'Error 500',
        to: '/500',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'ToDocs',
    href: 'https://coreui.io/react/docs/templates/installation/',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  },
]

export default _sideNav
