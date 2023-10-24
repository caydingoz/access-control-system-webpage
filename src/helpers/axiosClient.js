import axios from 'axios'

const API_URL = 'https://localhost:7118/api/'

const postAsync = async (url, datas) => {
  try {
    const response = await axios.post(API_URL + url, datas)
    return response.data
  } catch {
    return { success: false, errorMessage: 'Server Error!' }
  }
}
const getAsync = async (url, datas) => {
  try {
    const response = await axios.get(API_URL + url, datas)
    return response.data
  } catch {
    return { success: false, errorMessage: 'Server Error!' }
  }
}
const putAsync = async (url, datas) => {
  try {
    const response = await axios.put(API_URL + url, datas)
    return response.data
  } catch {
    return { success: false, errorMessage: 'Server Error!' }
  }
}
const deleteAsync = async (url, datas) => {
  try {
    const response = await axios.delete(API_URL + url, datas)
    return response.data
  } catch {
    return { success: false, errorMessage: 'Server Error!' }
  }
}

const axiosClient = {
  getAsync,
  postAsync,
  putAsync,
  deleteAsync,
}

export default axiosClient
