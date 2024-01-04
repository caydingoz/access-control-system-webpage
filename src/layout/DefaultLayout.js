import React, { useEffect } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import AuthService from '../services/AuthService'

const DefaultLayout = () => {
  const authService = AuthService()
  useEffect(() => {
    const fetchData = async () => {
      await authService.getUserRolesAndPermissions()
    }
    fetchData()
  }, [authService])

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 min-vh-100 px-3">
          <AppContent />
        </div>
        <div className="pt-5">
          <AppFooter />
        </div>
      </div>
    </div>
  )
}

export default DefaultLayout
