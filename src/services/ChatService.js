import axiosClient from '../helpers/axiosClient'

const getChatMessagesAsync = async (count, receiverId, lastMessageId = 0) => {
  const params = new URLSearchParams({
    count,
    receiverId,
    lastMessageId,
  })

  const url = `chat?${params.toString()}`
  const response = await axiosClient.getAsync(url)
  return response
}
const getChatOverviewAsync = async (page, count) => {
  const params = new URLSearchParams({
    page,
    count,
  })

  const url = `chat/overview?${params.toString()}`
  const response = await axiosClient.getAsync(url)
  return response
}
const sendChatMessageAsync = async (message) => {
  const response = await axiosClient.postAsync(`chat/message`, message)
  return response
}
const readAllChatMessagesAsync = async (senderId) => {
  const params = new URLSearchParams({
    senderId,
  })
  const response = await axiosClient.putAsync(`chat/read?${params.toString()}`)
  return response
}
const readChatMessagesAsync = async (messageId) => {
  const params = new URLSearchParams({
    messageId,
  })
  const response = await axiosClient.putAsync(`chat/message/read?${params.toString()}`)
  return response
}

const ChatService = {
  getChatMessagesAsync,
  getChatOverviewAsync,
  sendChatMessageAsync,
  readAllChatMessagesAsync,
  readChatMessagesAsync,
}

export default ChatService
