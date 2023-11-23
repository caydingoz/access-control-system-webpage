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
  const tokenInfo = localStorage.getItem('token')
  const datas = {
    accessToken: tokenInfo.accessToken,
    refreshToken: tokenInfo.refreshToken,
  }
  const response = await fetchAsync('auth/refresh-token', datas, 'post')
  if (response.success) {
    localStorage.setItem('token', JSON.stringify(response.data))
  } else {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
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
    if (error.code === 'ERR_BAD_REQUEST') return { success: false, errorMessage: 'Bad request!' }
    if (error.response.status === 401) {
      try {
        await refreshToken()
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
        return { success: false, errorMessage: 'Server error!' }
      }
    }
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
