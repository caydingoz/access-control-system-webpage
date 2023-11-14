import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const Anonymous = () => {
  return true ? <Navigate to="/dashboard" replace /> : <Outlet />
}

export default Anonymous
