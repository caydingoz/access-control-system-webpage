import React from 'react'
import { Box, Avatar, Typography } from '@mui/joy'

const ChatHeader = ({ selectedChat, onlineUsers }) => {
  return (
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
      {selectedChat.userId && (
        <>
          <Avatar size="sm" sx={{ mr: 1 }} src={`/images/${selectedChat.image}`} />
          <Box>
            <Typography level="title-sm">{selectedChat.name}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: onlineUsers.some((userId) => userId === selectedChat.userId) ? 'green' : 'gray',
                }}
              />
              <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                {onlineUsers.some((userId) => userId === selectedChat.userId) ? 'Online' : 'Offline'}
              </Typography>
            </Box>
          </Box>
        </>
      )}
    </Box>
  )
}

export default ChatHeader
