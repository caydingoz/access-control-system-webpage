import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const Anonymous = () => {
  return true ? <Navigate to="/" replace /> : <Outlet />
}

export default Anonymous
