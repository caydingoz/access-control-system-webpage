import axios from 'axios'
import { Navigate } from 'react-router-dom'

const API_URL = 'https://localhost:7118/api/'

const postAsync = async (url, datas) => {
  try {
    const response = await axios.post(API_URL + url, datas)
    return response.data
  } catch (error) {
    if (error.response.status === 401) {
      try {
        await refreshToken()
        const response = await axios.post(API_URL + url, datas)
        return response.data
      } catch (error) {
        return { success: false, errorMessage: 'Server Error!' }
      }
    }
    return { success: false, errorMessage: 'Server Error!' }
  }
}
const getAsync = async (url, datas) => {
  try {
    const response = await axios.get(API_URL + url, datas)
    return response.data
  } catch (error) {
    if (error.response.status === 401) {
      try {
        await refreshToken()
        const response = await axios.get(API_URL + url, datas)
        return response.data
      } catch (error) {
        return { success: false, errorMessage: 'Server Error!' }
      }
    }
    return { success: false, errorMessage: 'Server Error!' }
  }
}
const putAsync = async (url, datas) => {
  try {
    const response = await axios.put(API_URL + url, datas)
    return response.data
  } catch (error) {
    if (error.response.status === 401) {
      try {
        await refreshToken()
        const response = await axios.put(API_URL + url, datas)
        return response.data
      } catch (error) {
        return { success: false, errorMessage: 'Server Error!' }
      }
    }
    return { success: false, errorMessage: 'Server Error!' }
  }
}
const deleteAsync = async (url, datas) => {
  try {
    const response = await axios.delete(API_URL + url, datas)
    return response.data
  } catch (error) {
    if (error.response.status === 401) {
      try {
        await refreshToken()
        const response = await axios.delete(API_URL + url, datas)
        return response.data
      } catch (error) {
        return { success: false, errorMessage: 'Server Error!' }
      }
    }
    return { success: false, errorMessage: 'Server Error!' }
  }
}

const refreshToken = async () => {
  const authInfo = JSON.parse(localStorage.getItem('userAuth'))
  const response = await axios.post('auth/refresh-token', {
    accessToken: authInfo.accessToken,
    refreshToken: authInfo.refreshToken,
  })
  if (response.success) {
    localStorage.setItem('userAuth', JSON.stringify(response.data))
  } else {
    Navigate('/login')
  }
}

const axiosClient = {
  getAsync,
  postAsync,
  putAsync,
  deleteAsync,
}

export default axiosClient
