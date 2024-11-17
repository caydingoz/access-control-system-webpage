import React from 'react'
import { Typography, Box } from '@mui/joy'

export default function ActivityDetail({ activity = {} }) {
  const calculateDuration = (startTime, endTime) => {
    const start = new Date(startTime)
    const end = new Date(endTime)
    const diffMs = end - start // Difference in milliseconds

    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours}h ${minutes}m`
  }
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
        p: 1,
        borderRadius: 1,
        backgroundColor: '#f5f5f5',
        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
        maxWidth: '17rem',
        minWidth: '13rem',
      }}
    >
      <Typography
        sx={{
          fontSize: '0.9rem',
          fontWeight: 'bold',
          color: '#333',
          mb: 0.5,
        }}
      >
        {activity.workItem.title}
      </Typography>
      <Typography sx={{ fontSize: '0.80rem', color: '#666' }}>{activity.description}</Typography>
      <Box sx={{ mt: 0.5 }}>
        <Typography sx={{ fontSize: '0.75rem', color: '#999', display: 'flex', alignItems: 'center' }}>
          ⏲️ Start:{' '}
          {new Date(activity.startTime).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', color: '#999', display: 'flex', alignItems: 'center', mt: 0.25 }}>
          ⏰ End:{' '}
          {new Date(activity.endTime).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', color: '#999', display: 'flex', alignItems: 'center', mt: 0.25 }}>
          ⏳ Duration: {calculateDuration(activity.startTime, activity.endTime)}
        </Typography>
      </Box>
    </Box>
  )
}
