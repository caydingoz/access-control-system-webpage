import axios from 'axios'
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

const fetchAsync = async (url, datas, method) => {
  try {
    const response = await axios({
      method: method,
      url: API_URL + url,
      data: datas,
    })
    return response.data
  } catch (error) {
    return { success: false, errorMessage: 'Hata!' }
  }
}

const axiosClient = {
  getAsync,
  postAsync,
  putAsync,
  deleteAsync,
}

export default axiosClient
