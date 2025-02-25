import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
  CHeaderBrand,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilEnvelopeOpen, cilMenu, cilBell, cilList } from '@coreui/icons'
import { cilContrast, cilMoon, cilSun } from '@coreui/icons'
import { HubConnectionBuilder } from '@microsoft/signalr'

import { AppBreadcrumb, AppHeaderDropdown } from '../index'
import { logo } from 'src/assets/brand/logo'
import { setSidebarShow } from '../../redux/slices/sidebarSlice'
import { useColorScheme } from '@mui/joy/styles'
import { setThemeMode } from '../../redux/slices/rSuiteThemeSlice'

const AppHeader = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebar.sidebarShow)
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const { setMode } = useColorScheme()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const connection = new HubConnectionBuilder()
      .withUrl('http://localhost:8080/hubs/notification', {
        accessTokenFactory: () => JSON.parse(token).accessToken,
      })
      .withAutomaticReconnect()
      .build()

    connection
      .start()
      .then(() => {
        connection.on('ReceiveNotification', (count) => {
          setUnreadCount((prevCount) => prevCount + count)
        })
      })
      .catch((err) => console.error('SignalR Connection Error: ', err))

    return () => {
      connection.stop()
    }
  }, [])

  return (
    <CHeader position="sticky" className="mb-4 p-0" style={{ zIndex: 500 }}>
      <CContainer fluid>
        <CHeaderToggler onClick={() => dispatch(setSidebarShow(!sidebarShow))}>
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
              <div className="position-relative">
                <CIcon icon={cilBell} size="lg" />
                {unreadCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{unreadCount}</span>
                )}
              </div>
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilList} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilEnvelopeOpen} size="lg" />
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
              {colorMode === 'dark' ? (
                <CIcon icon={cilMoon} size="lg" />
              ) : colorMode === 'auto' ? (
                <CIcon icon={cilContrast} size="lg" />
              ) : (
                <CIcon icon={cilSun} size="lg" />
              )}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem
                active={colorMode === 'light'}
                className="d-flex align-items-center"
                style={{ fontSize: '14px' }}
                as="button"
                type="button"
                onClick={() => {
                  setColorMode('light')
                  setMode('light')
                  dispatch(setThemeMode('light'))
                }}
              >
                <CIcon className="me-2" icon={cilSun} size="lg" /> Light
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'dark'}
                className="d-flex align-items-center"
                style={{ fontSize: '14px' }}
                as="button"
                type="button"
                onClick={() => {
                  setColorMode('dark')
                  setMode('dark')
                  dispatch(setThemeMode('dark'))
                }}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'auto'}
                className="d-flex align-items-center"
                as="button"
                style={{ fontSize: '14px' }}
                type="button"
                onClick={() => {
                  setColorMode('auto')
                  setMode('auto')
                  dispatch(setThemeMode('light'))
                }}
              >
                <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
