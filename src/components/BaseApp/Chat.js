import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import Sheet from '@mui/joy/Sheet'
import IconButton from '@mui/joy/IconButton'
import Button from '@mui/joy/Button'
import Input from '@mui/joy/Input'
import Divider from '@mui/joy/Divider'
import Typography from '@mui/joy/Typography'
import List from '@mui/joy/List'
import ListItem from '@mui/joy/ListItem'
import ListItemButton from '@mui/joy/ListItemButton'
import ListItemContent from '@mui/joy/ListItemContent'
import Avatar from '@mui/joy/Avatar'
import Box from '@mui/joy/Box'
import Chip from '@mui/joy/Chip'
import Badge from '@mui/joy/Badge'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import ChatRoundedIcon from '@mui/icons-material/ChatRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import ChatService from 'src/services/ChatService'
import TimeZoneConverter from 'src/helpers/timeZoneConverter'
import { HubConnectionBuilder } from '@microsoft/signalr'
import { DateTime } from 'luxon'

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
  const [isFetching, setIsFetching] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const getOldMessages = async () => {
    const res = await ChatService.getChatMessagesAsync(20, selectedChat.userId, messages.at(-1).id)
    if (res.success) {
      if (res.data.chatMessages.length === 0) {
        setHasMore(false)
      } else {
        setMessages((prevMessages) => [...prevMessages, res.data.chatMessages])
      }
      setIsFetching(false)
    }
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
          setMessages((prevMessages) =>
            prevMessages.map((chatMessage) => (messageIds.includes(chatMessage.id) ? { ...chatMessage, isRead: true } : chatMessage)),
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
        <Sheet
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
          <IconButton variant="plain" color="neutral" size="sm" onClick={() => setIsOpen(false)}>
            <CloseRoundedIcon />
          </IconButton>
        </Sheet>

        <Box sx={{ display: 'flex', flex: 1 }}>
          {/* User List with Search */}
          <Sheet
            sx={{
              width: 240,
              height: 400,
              borderRight: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'background.level1',
              '&::-webkit-scrollbar': {
                width: '8px',
                backgroundColor: 'background.level1',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'neutral.outlinedBorder',
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: 'neutral.outlinedHoverBorder',
                },
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'transparent',
              },
              scrollbarWidth: 'thin',
              scrollbarColor: 'var(--joy-palette-neutral-outlinedBorder) transparent',
            }}
          >
            <Box sx={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <Input size="sm" placeholder="Search user..." sx={{ margin: 1.5 }} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </Box>

            <List
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: 400,
                overflowY: 'auto',
                pb: 0,
              }}
            >
              <Box sx={{ flex: 1, overflowY: 'auto' }}>
                {filteredChats.map((chat) => (
                  <ListItem
                    key={chat.userId}
                    sx={{
                      backgroundColor: chat.unReadMessageCount > 0 && 'background.level3',
                      '&:hover': {
                        filter: theme === 'dark' ? 'brightness(1.3)' : 'brightness(0.95)',
                      },
                    }}
                  >
                    <ListItemButton selected={selectedChat?.userId === chat.userId} onClick={() => handleChatSelect(chat)}>
                      <Avatar size="sm" sx={{ mr: 1 }} src={`/images/${chat.image}`} />
                      <ListItemContent>
                        <Typography level="title-sm" sx={{ fontWeight: chat.unReadMessageCount > 0 && 'bold' }}>
                          {chat.name}
                        </Typography>
                        <Typography level="body-xs" sx={{ fontWeight: chat.unReadMessageCount > 0 && 'bold' }} noWrap>
                          {chat.lastMessage}
                        </Typography>
                      </ListItemContent>
                      {chat.unReadMessageCount > 0 && (
                        <Chip size="sm" variant="solid" color="success">
                          {chat.unReadMessageCount}
                        </Chip>
                      )}
                    </ListItemButton>
                  </ListItem>
                ))}
              </Box>
              <Box
                sx={{
                  padding: 2,
                  backdropFilter: 'blur(2px)',
                }}
              >
                <Button
                  variant="solid"
                  color="success"
                  size="sm"
                  sx={{
                    width: '100%',
                    borderRadius: 'md',
                  }}
                  onClick={() => alert('Yeni kullanıcı ile sohbet başlatıldı!')}
                >
                  New Chat
                </Button>
              </Box>
            </List>
          </Sheet>

          {/* Chat area */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: 400 }}>
            {selectedChat?.userId && (
              <Box
                sx={{
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  height: 50,
                  display: 'flex',
                  alignItems: 'center',
                  pl: 1,
                  backgroundColor: 'background.level1',
                }}
              >
                <Avatar size="sm" sx={{ mr: 1 }} src={`/images/${selectedChat.image}`} />
                <Typography level="title-sm">{selectedChat.name}</Typography>
              </Box>
            )}
            <Sheet
              sx={{
                flex: 1,
                px: 2,
                py: 2,
                display: 'flex',
                flexDirection: 'column-reverse',
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                  width: '4px',
                  backgroundColor: 'background.level1',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'neutral.outlinedBorder',
                  borderRadius: '8px',
                  '&:hover': {
                    backgroundColor: 'neutral.outlinedHoverBorder',
                  },
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: 'transparent',
                },
                scrollbarWidth: 'thin',
                scrollbarColor: 'var(--joy-palette-neutral-outlinedBorder) transparent',
              }}
            >
              {selectedChat ? (
                messages.map((message, index) => {
                  const currentMessageDate = new Date(message.sentAt).toLocaleDateString()
                  const previousMessageDate = index > 0 ? new Date(messages[index - 1].sentAt).toLocaleDateString() : null

                  return (
                    <React.Fragment key={index}>
                      {currentMessageDate !== previousMessageDate && previousMessageDate && (
                        <Divider sx={{ my: 2, color: theme === 'dark' ? 'white' : 'black' }}>
                          <Typography level="body-sm">{previousMessageDate}</Typography>
                        </Divider>
                      )}
                      <Box
                        sx={{
                          mb: 0.5,
                          textAlign: message.receiverId !== selectedChat.userId ? 'left' : 'right',
                        }}
                      >
                        <Typography
                          level="body-sm"
                          sx={{
                            display: 'inline-block',
                            padding: 1,
                            background:
                              message.receiverId !== selectedChat.userId
                                ? theme === 'dark'
                                  ? '#4a3222'
                                  : '#fff3e0'
                                : theme === 'dark'
                                  ? '#004d4d'
                                  : '#e0f7fa',
                            borderRadius: 8,
                            fontSize: '13px',
                            maxWidth: '75%',
                            color: theme === 'dark' ? 'white' : 'black',
                          }}
                        >
                          {message.content}
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: message.receiverId !== selectedChat.userId ? 'flex-start' : 'flex-end',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          <Typography level="body-sm" sx={{ fontSize: '8px' }}>
                            {TimeZoneConverter.convertUtcToIstanbul(message.sentAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </Typography>
                          {message.receiverId === selectedChat.userId &&
                            (message.isRead === true ? (
                              <DoneAllIcon sx={{ fontSize: '10px', color: '#4caf50' }} />
                            ) : (
                              <DoneAllIcon sx={{ fontSize: '10px', color: 'gray' }} />
                            ))}
                        </Box>
                      </Box>
                      {index === messages.length - 1 && (
                        <Divider sx={{ my: 2, color: theme === 'dark' ? 'white' : 'black' }}>
                          <Typography level="body-sm">{currentMessageDate}</Typography>
                        </Divider>
                      )}
                    </React.Fragment>
                  )
                })
              ) : (
                <Typography level="body-sm" sx={{ textAlign: 'center' }}>
                  Start a conversation...
                </Typography>
              )}

              <div ref={messagesEndRef} />
            </Sheet>

            <Sheet
              sx={{
                p: 2,
                display: 'flex',
                gap: 1,
                borderTop: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.level1',
              }}
            >
              <Input
                size="sm"
                placeholder="Type a message..."
                sx={{ flex: 1 }}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={!selectedChat}
              />
              <Button
                size="sm"
                variant="solid"
                color="primary"
                startDecorator={<SendRoundedIcon />}
                onClick={handleSendMessage}
                disabled={!selectedChat}
              >
                Send
              </Button>
            </Sheet>
          </Box>
        </Box>
      </Sheet>
    </>
  )
}

export default Chat
