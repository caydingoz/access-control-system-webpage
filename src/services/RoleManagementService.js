import axiosClient from '../helpers/axiosClient'

const getRolesAsync = async (page, count, sortType, column, filterName = null) => {
  const params = new URLSearchParams({
    page,
    count,
    column,
    sortType,
  })

  if (filterName) {
    params.append('filterName', filterName)
  }

  const url = `roles?${params.toString()}`
  const response = await axiosClient.getAsync(url)
  return response
}
const getPermissionsAsync = async () => {
  const response = await axiosClient.getAsync(`roles/permissions`)
  return response
}
const deleteRolesAsync = async (ids) => {
  const response = await axiosClient.deleteAsync(`roles`, { ids: ids })
  return response
}
const getPermissionsByRoleIdAsync = async (page, count, roleId, sortType, column) => {
  const response = await axiosClient.getAsync(`roles/${roleId}/permissions?page=${page}&count=${count}&column=${column}&sortType=${sortType}`)
  return response
}
const deletePermissionsByIdAsync = async (roleId, id) => {
  const response = await axiosClient.deleteAsync(`roles/${roleId}/permissions`, { permissionIds: [id] })
  return response
}
const changePermissionTypeAsync = async (roleId, id, newPermissionType) => {
  const response = await axiosClient.putAsync(`roles/${roleId}/permissions`, { permissions: [{ id: id, type: newPermissionType }] })
  return response
}

const RoleManagementService = {
  getRolesAsync,
  deleteRolesAsync,
  getPermissionsAsync,
  getPermissionsByRoleIdAsync,
  deletePermissionsByIdAsync,
  changePermissionTypeAsync,
}

export default RoleManagementService
