import axiosClient from '../helpers/axiosClient'

const getUsersAsync = async (page, count, sortType, column, filterName = null) => {
  const params = new URLSearchParams({
    page,
    count,
    column,
    sortType,
  })

  if (filterName) {
    params.append('filterName', filterName)
  }

  const url = `user?${params.toString()}`
  const response = await axiosClient.getAsync(url)
  return response
}
const addUserAsync = async (user) => {
  const response = await axiosClient.postAsync(`user`, { user: user })
  return response
}
const deleteUsersAsync = async (ids) => {
  const response = await axiosClient.deleteAsync(`user`, { ids: ids })
  return response
}

const UserService = {
  getUsersAsync,
  addUserAsync,
  deleteUsersAsync,
}

export default UserService
