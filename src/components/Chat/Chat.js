import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import ChatHeader from './ChatHeader'
import ChatInput from './ChatInput'
import ChatMessages from './ChatMessages'
import ChatUserList from './ChatUserList'
import NewChatUserList from './NewChatUserList'
import ChatService from 'src/services/ChatService'
import { HubConnectionBuilder } from '@microsoft/signalr'
import { DateTime } from 'luxon'
import { Badge, IconButton, Sheet, Box } from '@mui/joy'
import ChatRoundedIcon from '@mui/icons-material/ChatRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import Typography from '@mui/joy/Typography'

const Chat = () => {
  const theme = useSelector((state) => state.rSuiteTheme.themeMode)
  const [isOpen, setIsOpen] = useState(false)
  const [chatOverviews, setChatOverviews] = useState([])
  const [selectedChat, setSelectedChat] = useState({ userId: null })
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingOldMessages, setIsLoadingOldMessages] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [newChatOpen, setNewChatOpen] = useState(false)
  const messagesEndRef = useRef(null)
  const selectedChatRef = useRef(selectedChat.userId)
  const messagesContainerRef = useRef(null)

  const getOldMessages = async () => {
    const res = await ChatService.getChatMessagesAsync(40, selectedChat.userId, messages.at(-1).id)
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
            // eğer chat açıksa
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
          }
          setChatOverviews((prevChatOverviews) => {
            const updatedChatOverviews = prevChatOverviews.map((chatOverview) => {
              if (chatOverview.userId === message.senderId) {
                return {
                  ...chatOverview,
                  unReadMessageCount: selectedChatRef.current === message.senderId ? 0 : chatOverview.unReadMessageCount + 1,
                  lastMessage: message.content,
                  lastMessageTime: message.sentAt,
                }
              }
              return chatOverview
            })
            // Mesaj gönderen kullanıcıyı en üste taşı
            const senderChatOverview = updatedChatOverviews.find((chatOverview) => chatOverview.userId === message.senderId)
            return [senderChatOverview, ...updatedChatOverviews.filter((chatOverview) => chatOverview.userId !== message.senderId)]
          })
        })
        connection.on('ReadMessage', (messageIds) => {
          //signalr'dan gelen mesajlar okundu olarak isaretlenir
          const messageIdsArray = Array.isArray(messageIds) ? messageIds : [messageIds]
          setMessages((prevMessages) =>
            prevMessages.map((chatMessage) => (messageIdsArray.includes(chatMessage.id) ? { ...chatMessage, isRead: true } : chatMessage)),
          )
        })
        connection.on('OnlineUsersUpdated', (users) => {
          setOnlineUsers(users)
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

  const handleNewChat = (chat) => {
    setChatOverviews((prevChatOverviews) => {
      if (prevChatOverviews.find((chatOverview) => chatOverview.userId === chat.userId)) {
        return prevChatOverviews
      }
      return [
        {
          userId: chat.userId,
          name: chat.name,
          image: chat.image,
          lastMessage: '',
          unReadMessageCount: 0,
        },
        ...prevChatOverviews,
      ]
    })
    setMessages([])
    setSelectedChat(chat)
    setNewChatOpen(false)
    setHasMore(false)
  }

  const handleChatSelect = async (chat) => {
    setMessages([])
    setSelectedChat(chat)
    setHasMore(true)
    setIsLoadingOldMessages(false)
    const res = await ChatService.getChatMessagesAsync(50, chat.userId, 0)
    if (res.success) {
      setMessages(res.data.chatMessages)
      if (res.data.chatMessages.length < 50) {
        setHasMore(false)
      }
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
            receiverId: selectedChat.userId,
            sentAt: DateTime.utc(),
            isRead: false,
          },
          ...prevMessages,
        ])
        setChatOverviews((prevChatOverviews) => {
          const updatedChatOverviews = prevChatOverviews.map((chatOverview) => {
            if (chatOverview.userId === selectedChat.userId) {
              return {
                ...chatOverview,
                lastMessage: newMessage,
                lastMessageTime: DateTime.utc(),
              }
            }
            return chatOverview
          })
          // Mesaj gönderilen kullanıcıyı en üste taşı
          const receiverChatOverview = updatedChatOverviews.find((chatOverview) => chatOverview.userId === selectedChat.userId)
          return [receiverChatOverview, ...updatedChatOverviews.filter((chatOverview) => chatOverview.userId !== selectedChat.userId)]
        })
        messagesContainerRef.current.scrollTop = 0
      }
    }
  }

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
          width: 50,
          height: 50,
          boxShadow: 'sm',
          zIndex: 2000,
        }}
        onClick={() => {
          setIsOpen(!isOpen)
          setNewChatOpen(false)
        }}
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

      {newChatOpen && (
        <Sheet
          sx={{
            position: 'fixed',
            bottom: 85,
            right: 625,
            width: 240,
            height: 400,
            borderRadius: 'lg',
            boxShadow: 'lg',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 2000,
          }}
        >
          <NewChatUserList theme={theme} handleNewChat={handleNewChat} setNewChatOpen={setNewChatOpen} />
        </Sheet>
      )}
      <Sheet
        sx={{
          position: 'fixed',
          bottom: 85,
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
        <Box
          sx={{
            px: 2,
            py: 1.5,
            height: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.level2',
          }}
        >
          <Typography level="title-md">Chat</Typography>
          <IconButton
            variant="plain"
            color="neutral"
            size="sm"
            onClick={() => {
              setIsOpen(!isOpen)
              setNewChatOpen(false)
            }}
          >
            <CloseRoundedIcon />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', flex: 1 }}>
          <ChatUserList
            chatOverviews={chatOverviews}
            selectedChat={selectedChat}
            handleChatSelect={handleChatSelect}
            newChatOpen={newChatOpen}
            setNewChatOpen={setNewChatOpen}
            theme={theme}
          />
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: 400 }}>
            <ChatHeader selectedChat={selectedChat} onlineUsers={onlineUsers} />
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
