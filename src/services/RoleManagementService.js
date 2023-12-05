import axiosClient from '../helpers/axiosClient'

const getRolesAsync = async (page, count) => {
  const response = await axiosClient.getAsync(`roles?page=${page}&count=${count}`)
  return response
}
const getPermissionsByRoleIdAsync = async (page, count, roleId) => {
  const response = await axiosClient.getAsync(`roles/${roleId}/permissions?page=${page}&count=${count}`)
  return response
}

const RoleManagementService = {
  getRolesAsync,
  getPermissionsByRoleIdAsync,
}

export default RoleManagementService
