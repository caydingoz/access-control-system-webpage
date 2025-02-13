import React from 'react'
import { Sheet, Input, Button } from '@mui/joy'
import SendRoundedIcon from '@mui/icons-material/SendRounded'

const ChatInput = ({ newMessage, setNewMessage, handleSendMessage, selectedChat }) => {
  return (
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
        disabled={!selectedChat.userId}
      >
        Send
      </Button>
    </Sheet>
  )
}

export default ChatInput
