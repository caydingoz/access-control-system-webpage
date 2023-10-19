import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter>
      <div>
        <span className="ms-1">&copy; 2023 caydingoz</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Admin Panel</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
