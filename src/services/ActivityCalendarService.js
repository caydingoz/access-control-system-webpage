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

const createActivityAsync = async (activity) => {
  const url = 'activity'
  const response = await axiosClient.postAsync(url, activity)
  return response
}

const updateActivityAsync = async (activity) => {
  const url = 'activity'
  const response = await axiosClient.putAsync(url, activity)
  return response
}

const getUserWorkItemsAsync = async () => {
  const url = 'activity/workItem/user'
  const response = await axiosClient.getAsync(url)
  return response
}

const ActivityCalendarService = {
  getActivitiesAsync,
  getUserWorkItemsAsync,
  createActivityAsync,
  updateActivityAsync,
}

export default ActivityCalendarService
