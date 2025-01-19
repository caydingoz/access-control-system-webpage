import axiosClient from '../helpers/axiosClient'

const getServiceStatusAsync = async () => {
  const url = 'healthcheck'
  const response = await axiosClient.getAsync(url)
  return response
}

const ServiceStatusService = {
  getServiceStatusAsync,
}

export default ServiceStatusService
