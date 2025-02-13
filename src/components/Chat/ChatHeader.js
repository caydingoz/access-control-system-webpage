import React from 'react'
import { IconButton, Typography, Sheet } from '@mui/joy'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

const ChatHeader = ({ onClose }) => {
  return (
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
      <IconButton variant="plain" color="neutral" size="sm" onClick={onClose}>
        <CloseRoundedIcon />
      </IconButton>
    </Sheet>
  )
}

export default ChatHeader
