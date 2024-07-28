import { useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { showAlert } from '../slices/alertSlice'
import { loggedOut } from '../slices/authSlice'
import AuthService from '../services/AuthService'
import { v4 as uuidv4 } from 'uuid'
import { hideLoading, showLoading } from 'src/slices/loadingSlice'

const API_URL = 'http://localhost:8080/api/'

const useAxiosInterceptors = () => {
  const dispatch = useDispatch()
  const authService = AuthService()

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token')
        const accessToken = token ? 'Bearer ' + JSON.parse(token).accessToken : ''
        if (accessToken) {
          config.headers.Authorization = accessToken
        }
        if (config.url !== API_URL + 'auth/refresh-token') dispatch(showLoading())
        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )

    const responseInterceptor = axios.interceptors.response.use(
      (response) => {
        if (!response.data.success) dispatch(showAlert({ id: uuidv4(), message: response.data.errorMessage, alertType: 'Error' }))
        else if (response.config.method !== 'get' && response.config.url !== API_URL + 'auth/refresh-token') {
          dispatch(showAlert({ id: uuidv4(), message: 'Operation completed successfully!', alertType: 'Success' }))
        }
        if (response.config.url !== API_URL + 'auth/refresh-token') dispatch(hideLoading())
        return response
      },
      async (error) => {
        if (error.code === 'ERR_NETWORK') {
          dispatch(showAlert({ id: uuidv4(), message: 'Server connection failed!', alertType: 'Error' }))
          dispatch(hideLoading())
          return Promise.reject(error)
        }
        if (error.response?.status === 401) {
          try {
            await refreshToken()
            return axios(error.config)
          } catch (refreshError) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            dispatch(loggedOut())
            if (window.location.hash !== '#/login') {
              window.location.replace('#/login')
            }
          }
        } else if (error.response?.status === 403) {
          dispatch(showAlert({ id: uuidv4(), message: 'You do not have the permissions to perform this action.', alertType: 'Error' }))
        } else {
          dispatch(showAlert({ id: uuidv4(), message: error.response?.data?.message || 'Server error!', alertType: 'Error' }))
        }
        dispatch(hideLoading())
        return Promise.reject(error)
      },
    )

    const refreshToken = async () => {
      const tokenJson = localStorage.getItem('token')
      if (!tokenJson) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        dispatch(loggedOut())
      }
      const token = JSON.parse(tokenJson)
      const datas = {
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
      }
      try {
        const response = await axios.post(API_URL + 'auth/refresh-token', datas)
        if (response.data.success) {
          localStorage.setItem('token', JSON.stringify(response.data.data))
          // You should set user
          await authService.getUserRolesAndPermissions()
        } else {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          dispatch(loggedOut())
          if (window.location.hash !== '#/login') {
            window.location.replace('#/login')
          }
        }
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        dispatch(loggedOut())
        if (window.location.hash !== '#/login') {
          window.location.replace('#/login')
        }
      }
    }

    return () => {
      axios.interceptors.request.eject(requestInterceptor)
      axios.interceptors.response.eject(responseInterceptor)
    }
  }, [dispatch, authService])
}

export default useAxiosInterceptors
