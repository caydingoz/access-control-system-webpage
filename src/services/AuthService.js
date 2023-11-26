import axiosClient from '../helpers/axiosClient'
import { useDispatch } from 'react-redux'
import { loggedIn, setRoles, loggedOut } from '../slices/authSlice'

const AuthService = () => {
  const dispatch = useDispatch()
  const register = async (firstName, lastName, phoneNumber, email, password) => {
    const response = await axiosClient.postAsync('auth/register', {
      firstName,
      lastName,
      phoneNumber,
      email,
      password,
    })
    if (response.Success) {
      var tokenData = { accessToken: response.data.token.accessToken, refreshToken: response.data.token.refreshToken }
      var userData = { firstName: response.data.firstName, lastName: response.data.lastName }
      localStorage.setItem('token', JSON.stringify(tokenData))
      localStorage.setItem('user', JSON.stringify(userData))
      dispatch(loggedIn({ roles: response.data.roles, permissions: response.data.permissions }))
    }
    return response
  }

  const login = async (email, password) => {
    const response = await axiosClient.postAsync('auth/login', {
      email,
      password,
    })
    if (response.success) {
      var tokenData = { accessToken: response.data.token.accessToken, refreshToken: response.data.token.refreshToken }
      var userData = { firstName: response.data.firstName, lastName: response.data.lastName }
      localStorage.setItem('token', JSON.stringify(tokenData))
      localStorage.setItem('user', JSON.stringify(userData))
      dispatch(loggedIn({ roles: response.data.roles, permissions: response.data.permissions }))
    }
    return response
  }

  const logout = async () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    dispatch(loggedOut())
    return { success: true }
  }

  const getUserRolesAndPermissions = async () => {
    const response = await axiosClient.getAsync('auth/roles-and-permissions')
    if (response.Success) {
      dispatch(setRoles({ roles: response.data.roles, permissions: response.data.permissions }))
    }
    return response
  }

  return {
    register,
    login,
    logout,
    getUserRolesAndPermissions,
  }
}

export default AuthService
