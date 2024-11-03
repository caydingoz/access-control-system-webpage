import axiosClient from '../helpers/axiosClient'

const getAllAbsenceRequestsAsync = async (page, count, status = null, type = null, filterName = null) => {
  const params = new URLSearchParams({
    page,
    count,
  })

  if (status) {
    params.append('status', status)
  }
  if (type) {
    params.append('type', type)
  }
  if (filterName) {
    params.append('filterName', filterName)
  }

  const url = `absence/admin/requests?${params.toString()}`
  const response = await axiosClient.getAsync(url)
  return response
}

const getUserAbsenceRequestsAsync = async (page, count, status, type, description) => {
  const params = new URLSearchParams({
    page,
    count,
  })

  if (status) {
    params.append('status', status)
  }
  if (type) {
    params.append('type', type)
  }
  if (description) {
    params.append('description', description)
  }
  const url = `absence/user/requests?${params.toString()}`
  const response = await axiosClient.getAsync(url)
  return response
}
const getUserAbsenceInfoAsync = async () => {
  const url = 'absence/user/accurals'
  const response = await axiosClient.getAsync(url)
  return response
}
const createAbsenceRequestAsync = async (absence) => {
  absence.startTime = new Date(absence.startTime).toLocaleString('sv-SE', { timeZone: 'Europe/Istanbul' }).replace(' ', 'T')
  absence.endTime = new Date(absence.endTime).toLocaleString('sv-SE', { timeZone: 'Europe/Istanbul' }).replace(' ', 'T')
  const url = 'absence'
  const response = await axiosClient.postAsync(url, absence)
  return response
}
const updateAbsenceRequestStatusAsync = async (id, status) => {
  const url = 'absence'
  const response = await axiosClient.putAsync(url, { id: id, status: status })
  return response
}
const deleteAbsenceRequestAsync = async (id) => {
  const url = `absence/user?id=${id}`
  const response = await axiosClient.deleteAsync(url)
  return response
}

const AbsenceManagementService = {
  getAllAbsenceRequestsAsync,
  getUserAbsenceRequestsAsync,
  getUserAbsenceInfoAsync,
  createAbsenceRequestAsync,
  updateAbsenceRequestStatusAsync,
  deleteAbsenceRequestAsync,
}

export default AbsenceManagementService
