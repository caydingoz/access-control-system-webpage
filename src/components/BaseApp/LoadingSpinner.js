import React from 'react'
import CircularProgress from '@mui/joy/CircularProgress'
import { Box } from '@mui/joy'

const LoadingSpinner = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        display: 'flex',
        paddingBottom: '10px',
        bottom: '0',
        zIndex: 9999,
      }}
    >
      <CircularProgress
        size="sm"
        variant="solid"
        color="primary"
        sx={{
          '--CircularProgress-trackThickness': '4px',
          '--CircularProgress-progressThickness': '4px',
        }}
      />
    </Box>
  )
}

export default LoadingSpinner
