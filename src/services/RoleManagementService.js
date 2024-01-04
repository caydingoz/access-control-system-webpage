import axiosClient from '../helpers/axiosClient'

const getRolesAsync = async (page, count, sortType, column) => {
  const response = await axiosClient.getAsync(`roles?page=${page}&count=${count}&column=${column}&sortType=${sortType}`)
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
  const response = await axiosClient.deleteAsync(`roles/${roleId}/permissions`, { id: id })
  return response
}
const changePermissionTypeAsync = async (roleId, id, newPermissionType) => {
  const response = await axiosClient.putAsync(`roles/${roleId}/permissions`, { id: id, permissionType: newPermissionType })
  return response
}

const RoleManagementService = {
  getRolesAsync,
  deleteRolesAsync,
  getPermissionsByRoleIdAsync,
  deletePermissionsByIdAsync,
  changePermissionTypeAsync,
}

export default RoleManagementService
