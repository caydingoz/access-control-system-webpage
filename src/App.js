import React, { Component, Suspense } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import './scss/style.scss'
import './css/style.css'

import Anonymous from './components/Auth/Anonymous'
import ProtectedRoute from './components/Auth/ProtectedRoute'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/Login'))
const Register = React.lazy(() => import('./views/pages/Register'))
const Page500 = React.lazy(() => import('./views/pages/Page500'))

//Buraya eklenen componentler full sayfa açılıyor.
class App extends Component {
  render() {
    return (
      <HashRouter className="fixed-scrollbar">
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
}

export default App
