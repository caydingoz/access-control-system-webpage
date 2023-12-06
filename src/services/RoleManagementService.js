import axiosClient from '../helpers/axiosClient'

const getRolesAsync = async (page, count, order, orderBy) => {
  const response = await axiosClient.getAsync(`roles?page=${page}&count=${count}&column=${orderBy}&sortType=${order}`)
  return response
}
const getPermissionsByRoleIdAsync = async (page, count, roleId, order, orderBy) => {
  const response = await axiosClient.getAsync(`roles/${roleId}/permissions?page=${page}&count=${count}&column=${orderBy}&sortType=${order}`)
  return response
}

const RoleManagementService = {
  getRolesAsync,
  getPermissionsByRoleIdAsync,
}

export default RoleManagementService
