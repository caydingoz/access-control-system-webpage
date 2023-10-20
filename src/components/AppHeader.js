import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { CContainer, CHeader, CHeaderBrand, CHeaderNav, CNavLink, CNavItem, CHeaderToggler } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilEnvelopeOpen, cilMenu } from '@coreui/icons'

import { AppBreadcrumb, AppHeaderDropdown } from './index'
import { logo } from 'src/assets/brand/logo'

const AppHeader = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler className="ps-1" onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}>
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none" to="/">
          <CIcon icon={logo} height={48} alt="Logo" />
        </CHeaderBrand>
        <CHeaderNav>
          <AppBreadcrumb />
        </CHeaderNav>
        <CHeaderNav className="ms-auto">
          <CNavItem>
            <CNavLink href="#">
              {/* mesaj ikonu */}
              <CIcon icon={cilEnvelopeOpen} size="lg" />
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
        <div className="vr pr-2" />
        <CHeaderNav className="ms-3">
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
