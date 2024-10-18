import axiosClient from '../helpers/axiosClient'

const getUsersAsync = async (page, count, status, sortType, column, filterName = null) => {
  const params = new URLSearchParams({
    page,
    count,
    sortType,
    column,
  })

  if (filterName) {
    params.append('filterName', filterName)
  }
  if (status) {
    params.append('status', status)
  }

  const url = `user?${params.toString()}`
  const response = await axiosClient.getAsync(url)
  return response
}
const addUserAsync = async (user) => {
  const response = await axiosClient.postAsync(`user`, user)
  return response
}
const updateUserAsync = async (user) => {
  const response = await axiosClient.putAsync(`user`, user)
  return response
}
const deleteUsersAsync = async (ids) => {
  const response = await axiosClient.deleteAsync(`user`, { ids: ids })
  return response
}

const UserService = {
  getUsersAsync,
  addUserAsync,
  updateUserAsync,
  deleteUsersAsync,
}

export default UserService
