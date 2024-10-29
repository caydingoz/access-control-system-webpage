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
  activity.startTime = new Date(activity.startTime).toLocaleString('sv-SE', { timeZone: 'Europe/Istanbul' }).replace(' ', 'T')
  activity.endTime = new Date(activity.endTime).toLocaleString('sv-SE', { timeZone: 'Europe/Istanbul' }).replace(' ', 'T')
  const url = 'activity'
  const response = await axiosClient.postAsync(url, activity)
  return response
}

const updateActivityAsync = async (activity) => {
  activity.startTime = new Date(activity.startTime).toLocaleString('sv-SE', { timeZone: 'Europe/Istanbul' }).replace(' ', 'T')
  activity.endTime = new Date(activity.endTime).toLocaleString('sv-SE', { timeZone: 'Europe/Istanbul' }).replace(' ', 'T')
  const url = 'activity'
  const response = await axiosClient.putAsync(url, activity)
  return response
}

const deleteActivityByIdAsync = async (id) => {
  const response = await axiosClient.deleteAsync(`activity?id=${id}`)
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
  deleteActivityByIdAsync,
}

export default ActivityCalendarService
