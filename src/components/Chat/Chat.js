import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import ChatHeader from './ChatHeader'
import ChatInput from './ChatInput'
import ChatMessages from './ChatMessages'
import ChatUserList from './ChatUserList'
import ChatService from 'src/services/ChatService'
import { HubConnectionBuilder } from '@microsoft/signalr'
import { DateTime } from 'luxon'
import { Badge, IconButton, Sheet, Box } from '@mui/joy'
import ChatRoundedIcon from '@mui/icons-material/ChatRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

const Chat = () => {
  const theme = useSelector((state) => state.rSuiteTheme.themeMode)
  const messagesEndRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [chatOverviews, setChatOverviews] = useState([])
  const [selectedChat, setSelectedChat] = useState({ userId: null })
  const [searchTerm, setSearchTerm] = useState('')
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const selectedChatRef = useRef(selectedChat.userId)
  const [hasMore, setHasMore] = useState(true)
  const messagesContainerRef = useRef(null)
  const [isLoadingOldMessages, setIsLoadingOldMessages] = useState(false)

  const getOldMessages = async () => {
    const res = await ChatService.getChatMessagesAsync(20, selectedChat.userId, messages.at(-1).id)
    if (res.success) {
      if (res.data.chatMessages.length === 0) {
        setHasMore(false)
      } else {
        setMessages((prevMessages) => [...prevMessages, ...res.data.chatMessages])
      }
    }
  }

  const handleLoadOldMessages = async () => {
    setIsLoadingOldMessages(true)
    await getOldMessages()
    setIsLoadingOldMessages(false)
  }

  useEffect(() => {
    selectedChatRef.current = selectedChat.userId
    setHasMore(true)
    setIsLoadingOldMessages(false)
  }, [selectedChat.userId])

  useEffect(() => {
    const token = localStorage.getItem('token')
    const connection = new HubConnectionBuilder()
      .withUrl('http://localhost:8080/hubs/chat', {
        accessTokenFactory: () => JSON.parse(token).accessToken,
      })
      .withAutomaticReconnect()
      .build()

    connection
      .start()
      .then(() => {
        connection.on('ReceiveMessage', (message) => {
          if (selectedChatRef.current === message.senderId) {
            setMessages((prevMessages) => [
              {
                id: message.id,
                content: message.content,
                senderId: message.senderId,
                receiverId: message.receiverId,
                sentAt: message.sentAt,
                isRead: message.isRead,
              },
              ...prevMessages,
            ])
            ChatService.readChatMessagesAsync(message.id)
          } else {
            setChatOverviews((prevChatOverviews) => {
              return prevChatOverviews.map((chatOverview) => {
                if (chatOverview.userId === message.senderId) {
                  return {
                    ...chatOverview,
                    unReadMessageCount: chatOverview.unReadMessageCount + 1,
                  }
                }
                return chatOverview
              })
            })
          }
        })
        connection.on('ReadMessage', (messageIds) => {
          const messageIdsArray = Array.isArray(messageIds) ? messageIds : [messageIds]
          setMessages((prevMessages) =>
            prevMessages.map((chatMessage) => (messageIdsArray.includes(chatMessage.id) ? { ...chatMessage, isRead: true } : chatMessage)),
          )
        })
      })
      .catch((err) => console.error('SignalR Connection Error: ', err))

    return () => {
      connection.stop()
    }
  }, [])

  useEffect(() => {
    async function fetchData() {
      const res = await ChatService.getChatOverviewAsync(0, 20)
      if (res.success) {
        setChatOverviews(res.data.chats)
      }
    }
    fetchData()
  }, [])

  const handleChatSelect = async (chat) => {
    setMessages([])
    setSelectedChat(chat)
    const res = await ChatService.getChatMessagesAsync(20, chat.userId, 0)
    if (res.success) {
      setMessages(res.data.chatMessages)
    }
    if (chat.unReadMessageCount > 0) {
      await ChatService.readAllChatMessagesAsync(chat.userId)
      setChatOverviews((prevChatOverviews) => {
        return prevChatOverviews.map((chatOverview) => {
          if (chatOverview.userId === chat.userId) {
            return {
              ...chatOverview,
              unReadMessageCount: 0,
            }
          }
          return chatOverview
        })
      })
    }
  }

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const res = await ChatService.sendChatMessageAsync({ receiverId: selectedChat.userId, content: newMessage })
      if (res.success) {
        setNewMessage('')
        setMessages((prevMessages) => [
          {
            id: res.data,
            content: newMessage,
            senderId: prevMessages.at(0).senderId,
            receiverId: selectedChat.userId,
            sentAt: DateTime.utc(),
            isRead: false,
          },
          ...prevMessages,
        ])
      }
    }
  }

  const filteredChats = chatOverviews.filter((chat) => chat.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <>
      <IconButton
        variant="solid"
        color="primary"
        size="lg"
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          borderRadius: '50%',
          width: 56,
          height: 56,
          boxShadow: 'sm',
          zIndex: 2000,
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Badge
          badgeContent={chatOverviews.reduce((total, chat) => {
            return total + chat.unReadMessageCount
          }, 0)}
          color="primary"
        >
          {isOpen ? <CloseRoundedIcon /> : <ChatRoundedIcon />}
        </Badge>
      </IconButton>

      <Sheet
        sx={{
          position: 'fixed',
          bottom: 90,
          right: 20,
          width: 600,
          height: 450,
          borderRadius: 'lg',
          boxShadow: 'lg',
          display: isOpen ? 'flex' : 'none',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 2000,
        }}
      >
        <ChatHeader onClose={() => setIsOpen(false)} />
        <Box sx={{ display: 'flex', flex: 1 }}>
          <ChatUserList
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filteredChats={filteredChats}
            selectedChat={selectedChat}
            handleChatSelect={handleChatSelect}
            theme={theme}
          />
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: 400 }}>
            <ChatMessages
              messages={messages}
              selectedChat={selectedChat}
              theme={theme}
              hasMore={hasMore}
              isLoadingOldMessages={isLoadingOldMessages}
              handleLoadOldMessages={handleLoadOldMessages}
              messagesEndRef={messagesEndRef}
              messagesContainerRef={messagesContainerRef}
            />
            <ChatInput newMessage={newMessage} setNewMessage={setNewMessage} handleSendMessage={handleSendMessage} selectedChat={selectedChat} />
          </Box>
        </Box>
      </Sheet>
    </>
  )
}

export default Chat
