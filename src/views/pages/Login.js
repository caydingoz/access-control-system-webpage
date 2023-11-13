import { React, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CButton, CCard, CCardBody, CCardGroup, CCol, CContainer, CForm, CFormInput, CInputGroup, CInputGroupText, CRow, CAlert } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

import AuthService from '../../services/AuthService'

const Login = () => {
  const navigate = useNavigate()
  const [errorInfo, setErrorInfo] = useState({
    error: false,
    errorMessage: '',
  })
  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  function handleChange(evt) {
    const value = evt.target.value
    setForm({
      ...form,
      [evt.target.name]: value,
    })
  }
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput type="text" placeholder="Email" autoComplete="email" name="email" value={form.email} onChange={handleChange} />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                      />
                    </CInputGroup>
                    <CRow> {errorInfo.error && <CAlert color="danger">{errorInfo.errorMessage}</CAlert>} </CRow>
                    <CRow className="mb-4">
                      <CCol xs={6}>
                        <CButton
                          color="primary"
                          className="px-4"
                          onClick={async () => {
                            let res = await AuthService.login(form.email, form.password)
                            if (res.success) {
                              navigate('/dashboard')
                            } else {
                              setErrorInfo({
                                ...errorInfo,
                                error: true,
                                errorMessage: res.errorMessage,
                              })
                            }
                          }}
                        >
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
