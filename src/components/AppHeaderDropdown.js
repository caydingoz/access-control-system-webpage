import { React, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CAvatar, CBadge, CDropdown, CDropdownDivider, CDropdownHeader, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react'
import { cilEnvelopeOpen, cilSettings, cilUser, cilAccountLogout } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar from './../assets/images/avatar.jpg'
import AuthService from '../services/AuthService'

const AppHeaderDropdown = () => {
  const authService = AuthService()
  const navigate = useNavigate()
  const [errorInfo, setErrorInfo] = useState({
    error: false,
    errorMessage: '',
  })
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <CAvatar src={avatar} size="md" />
      </CDropdownToggle>
      <CDropdownMenu placement="bottom-end" className="pt-0">
        <CDropdownHeader className="bg-light fw-semibold py-2">Account</CDropdownHeader>
        <CDropdownItem href="#">
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilEnvelopeOpen} className="me-2" />
          Messages
          <CBadge color="success" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilSettings} className="me-2" />
          Settings
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem
          style={{ cursor: 'pointer' }}
          onClick={async () => {
            let res = await authService.logout()
            if (res.success) {
              navigate('/login')
            } else {
              setErrorInfo({
                ...errorInfo,
                error: true,
                errorMessage: res.errorMessage,
              })
            }
          }}
        >
          <CIcon icon={cilAccountLogout} className="me-2" />
          Log out
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
