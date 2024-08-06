import React from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { useSelector } from 'react-redux'
import LoadingSpinner from '../components/LoadingSpinner'
import { CssVarsProvider } from '@mui/joy/styles'

const DefaultLayout = () => {
  const { isLoading } = useSelector((state) => state.loading)

  return (
    <div>
      <CssVarsProvider>
        <AppSidebar />
        <div className="wrapper d-flex flex-column min-vh-100">
          <AppHeader />
          <div className="body flex-grow-1 min-vh-100 px-3">
            {isLoading && <LoadingSpinner />}
            <AppContent />
          </div>
          <div className="pt-5">
            <AppFooter />
          </div>
        </div>
      </CssVarsProvider>
    </div>
  )
}

export default DefaultLayout
