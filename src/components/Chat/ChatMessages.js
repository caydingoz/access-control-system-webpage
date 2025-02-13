import React from 'react'
import { Box, Typography, Divider, CircularProgress, Button, Sheet } from '@mui/joy'
import ArrowUpward from '@mui/icons-material/ArrowUpward'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import TimeZoneConverter from 'src/helpers/timeZoneConverter'

const ChatMessages = ({
  messages,
  selectedChat,
  theme,
  hasMore,
  isLoadingOldMessages,
  handleLoadOldMessages,
  messagesEndRef,
  messagesContainerRef,
}) => {
  return (
    <Sheet
      ref={messagesContainerRef}
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
      {selectedChat.userId ? (
        <>
          {messages.map((message, index) => {
            const currentMessageDate = TimeZoneConverter.convertUtcToIstanbul(message.sentAt).toLocaleDateString()
            const previousMessageDate = index > 0 ? TimeZoneConverter.convertUtcToIstanbul(messages[index - 1].sentAt).toLocaleDateString() : null

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
          })}
          {hasMore &&
            messages.length > 0 &&
            (isLoadingOldMessages ? (
              <CircularProgress size="sm" sx={{ alignSelf: 'center', mb: 2 }} />
            ) : (
              <Button size="xs" variant="outlined" color="primary" sx={{ alignSelf: 'center', mb: 2 }} onClick={handleLoadOldMessages}>
                <ArrowUpward fontSize="small" />
                <Typography level="body-sm" color="primary">
                  Load Older Messages
                </Typography>
              </Button>
            ))}
        </>
      ) : (
        <Typography level="body-sm" sx={{ textAlign: 'center' }}>
          Start a conversation...
        </Typography>
      )}

      <div ref={messagesEndRef} />
    </Sheet>
  )
}

export default ChatMessages
