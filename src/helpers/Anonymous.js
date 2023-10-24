import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const Anonymous = () => {
  const item = JSON.parse(localStorage.getItem('userAuth'))
  const token = item?.accessToken
  return token ? <Navigate to="/" replace /> : <Outlet />
}

export default Anonymous
