import axios from 'axios'
import { Navigate } from 'react-router-dom'

const API_URL = 'http://localhost:8080/api/'

const getAsync = async (url, datas) => {
  return await fetchAsync(url, datas, 'get')
}
const postAsync = async (url, datas) => {
  return await fetchAsync(url, datas, 'post')
}
const putAsync = async (url, datas) => {
  return await fetchAsync(url, datas, 'put')
}
const deleteAsync = async (url, datas) => {
  return await fetchAsync(url, datas, 'delete')
}

const getAuthorizationToken = () => {
  const token = localStorage.getItem('token')
  const accessToken = token ? 'Bearer ' + JSON.parse(token).accessToken : ''
  return accessToken
}

const refreshToken = async () => {
  const tokenJson = localStorage.getItem('token')
  if (!tokenJson) Navigate('/login')
  const token = JSON.parse(tokenJson)
  const datas = {
    accessToken: token.accessToken,
    refreshToken: token.refreshToken,
  }
  try {
    const response = await fetchAsync('auth/refresh-token', datas, 'post')
    if (response.success) {
      localStorage.setItem('token', JSON.stringify(response.data))
    } else {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      Navigate('/login')
    }
  } catch {
    Navigate('/login')
  }
}
const fetchAsync = async (url, datas, method) => {
  try {
    const response = await axios({
      method: method,
      url: API_URL + url,
      headers: {
        'Content-Type': 'application/json',
        Authorization: getAuthorizationToken(),
      },
      data: datas,
    })
    return response.data
  } catch (error) {
    if (error.code === 'ERR_NETWORK') return { success: false, errorMessage: 'Server connection failed!' }
    if (error.response.status === 401) {
      try {
        await refreshToken()
      } catch (error) {
        Navigate('/login')
      }
      try {
        const response = await axios({
          method: method,
          url: API_URL + url,
          headers: {
            'Content-Type': 'application/json',
            Authorization: getAuthorizationToken(),
          },
          data: datas,
        })
        return response.data
      } catch (error) {
        if (error.code === 'ERR_NETWORK') return { success: false, errorMessage: 'Server connection failed!' }
        return { success: false, errorMessage: 'Server error!' }
      }
    }
    if (error.code === 'ERR_BAD_REQUEST') return { success: false, errorMessage: 'Bad request!' }
    return { success: false, errorMessage: 'Server error!' }
  }
}

const axiosClient = {
  getAsync,
  postAsync,
  putAsync,
  deleteAsync,
}

export default axiosClient
