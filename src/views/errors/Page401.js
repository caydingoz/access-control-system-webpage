import React from 'react'
import { CButton, CCol, CContainer, CRow } from '@coreui/react'
import { useNavigate } from 'react-router-dom'

const Page401 = () => {
  const navigate = useNavigate()

  return (
    <div className="min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <div className="clearfix">
              <h1 className="float-start display-3 me-4">401</h1>
              <div className="pt-3">
                <h4>Unauthorized Access!</h4>
                <p className="text-medium-emphasis">You don&apos;t have permission to access this page.</p>
                <CButton color="primary" onClick={() => navigate('/')} style={{ marginTop: '10px' }}>
                  Go to Home
                </CButton>
              </div>
            </div>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Page401
