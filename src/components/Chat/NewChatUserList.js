import React, { useState, useEffect } from 'react'
import { Sheet, Input, List, ListItem, ListItemButton, ListItemContent, Avatar, Typography, Box } from '@mui/joy'
import IconButton from '@mui/joy/IconButton'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import ChatService from '../../services/ChatService'

const NewChatUserList = ({ theme, handleNewChat, setNewChatOpen }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [users, setAllUsers] = useState([])
  const normalizeString = (str) => str.replace(/İ/g, 'i').replace(/I/g, 'ı').toLowerCase()
  const filteredUsers = users.filter((user) => normalizeString(user.name).includes(normalizeString(searchTerm)))

  useEffect(() => {
    async function fetchAllUsers() {
      const res = await ChatService.getChatAllUsersAsync()
      if (res.success) {
        setAllUsers(res.data.users)
      }
    }
    fetchAllUsers()
  }, [])

  return (
    <Sheet
      sx={{
        width: 240,
        height: 400,
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
      <Box
        sx={{
          pl: 2,
          pr: 0.5,
          py: 1.5,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.level2',
        }}
      >
        <Typography level="title-sm">Select User</Typography>
        <IconButton variant="plain" sx={{ borderRadius: '35%' }} color="neutral" size="sm" onClick={() => setNewChatOpen(false)}>
          <CloseRoundedIcon />
        </IconButton>
      </Box>
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
          {filteredUsers.map((user) => (
            <ListItem
              key={user.userId}
              sx={{
                '&:hover': {
                  filter: theme === 'dark' ? 'brightness(1.3)' : 'brightness(0.95)',
                },
              }}
            >
              <ListItemButton onClick={() => handleNewChat(user)}>
                <Avatar size="sm" sx={{ mr: 1 }} src={`/images/${user.image}`} />
                <ListItemContent>
                  <Typography level="title-sm">{user.name}</Typography>
                </ListItemContent>
              </ListItemButton>
            </ListItem>
          ))}
        </Box>
      </List>
    </Sheet>
  )
}

export default NewChatUserList
