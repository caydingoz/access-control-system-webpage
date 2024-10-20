import axiosClient from '../helpers/axiosClient'

const getActivitiesAsync = async (startTime, endTime) => {
  const params = new URLSearchParams({
    startTime,
    endTime,
  })

  const url = `activity?${params.toString()}`
  const response = await axiosClient.getAsync(url)
  return response
}

const ActivityCalendarService = {
  getActivitiesAsync,
}

export default ActivityCalendarService
