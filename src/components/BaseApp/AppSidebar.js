import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setSidebarShow } from '../../slices/sidebarSlice'

import { CSidebar, CSidebarBrand, CSidebarHeader } from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import { logo } from 'src/assets/brand/logo'
import { sygnet } from 'src/assets/brand/sygnet'

// sidebar nav config
import navigation from '../../_sideNav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebar.sidebarShow)
  return (
    <CSidebar
      className="border-end"
      position="fixed"
      visible={sidebarShow}
      onVisibleChange={(visible) => dispatch(setSidebarShow(visible))}
      style={{ zIndex: 500 }}
    >
      <CSidebarHeader>
        <CSidebarBrand to="/">
          <CIcon customClassName="sidebar-brand-full" icon={logo} height={32} />
          <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} />
        </CSidebarBrand>
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
