import React, { useState } from 'react'
import { Sheet, Input, List, ListItem, ListItemButton, ListItemContent, Avatar, Typography, Box, Chip } from '@mui/joy'
import Button from '@mui/joy/Button'

const ChatUserList = ({ chatOverviews, selectedChat, handleChatSelect, newChatOpen, setNewChatOpen, theme }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const normalizeString = (str) => str.replace(/İ/g, 'i').replace(/I/g, 'ı').toLowerCase()
  const filteredChats = chatOverviews.filter((chat) => normalizeString(chat.name).includes(normalizeString(searchTerm)))

  return (
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
        <Input
          size="sm"
          placeholder="Search user..."
          sx={{ margin: 1.5 }}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
          }}
        />
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
                    {chat.lastMessage || '-'}
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
            onClick={() => setNewChatOpen(!newChatOpen)}
          >
            New Chat
          </Button>
        </Box>
      </List>
    </Sheet>
  )
}

export default ChatUserList
