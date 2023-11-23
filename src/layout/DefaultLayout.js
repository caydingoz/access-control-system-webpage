import React, { useEffect } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import AuthService from '../services/AuthService'

const DefaultLayout = () => {
  const authService = AuthService()
  useEffect(() => {
    const fetchData = async () => {
      await authService.getUserRoles()
    }
    fetchData()
  }, [authService])

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
