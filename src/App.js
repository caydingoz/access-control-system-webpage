import React, { Suspense } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import './scss/style.scss'
import 'rsuite/dist/rsuite.min.css'

import Anonymous from './components/Auth/Anonymous'
import ProtectedRoute from './components/Auth/ProtectedRoute'
import useAxiosInterceptors from './helpers/useAxiosInterceptors'
import AlertVariousStates from './components/Alert/AlertVariousStates'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/Login'))
const Register = React.lazy(() => import('./views/Register'))
const Page500 = React.lazy(() => import('./views/errors/Page500'))

//Buraya eklenen componentler full sayfa açılıyor.
const App = () => {
  useAxiosInterceptors()
  return (
    <HashRouter className="fixed-scrollbar">
      <AlertVariousStates />
      <Suspense fallback={loading}>
        <Routes>
          <Route element={<Anonymous />}>
            <Route exact path="/login" name="Login Page" element={<Login />} />
            <Route exact path="/register" name="Register Page" element={<Register />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="*" name="Home" element={<DefaultLayout />} />
          </Route>
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default App
