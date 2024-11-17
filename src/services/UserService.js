import axiosClient from '../helpers/axiosClient'

const getUsersAsync = async (page, count, status, sortType, column, filterName = null, filterRoles = null) => {
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
  if (filterRoles) {
    const rolesArray = typeof filterRoles === 'string' ? filterRoles.split(',').map((role) => role.trim()) : filterRoles
    rolesArray.forEach((roleId) => {
      params.append('roleIds', roleId)
    })
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
