import React from 'react'
import { Alert, IconButton, Typography, LinearProgress } from '@mui/joy'
import { useDispatch } from 'react-redux'
import { hideAlert } from '../../slices/alertSlice'
import { useCountUp } from 'use-count-up'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

const AlertItem = ({ alert, alertItem }) => {
  const dispatch = useDispatch()
  const { value, reset } = useCountUp({
    isCounting: true,
    duration: alert.alertType === 'Success' ? 2 : 6,
    easing: 'linear',
    start: 100,
    end: 0,
    onComplete: () => {
      dispatch(hideAlert(alert.id))
      reset()
      return { shouldRepeat: false }
    },
  })

  return (
    <Alert
      sx={{ alignItems: 'flex-start', width: '90%', marginBottom: '10px' }}
      startDecorator={alertItem.icon}
      variant="soft"
      color={alertItem.color}
      endDecorator={
        <IconButton
          size="sm"
          variant="soft"
          color={alertItem.color}
          onClick={() => {
            dispatch(hideAlert(alert.id))
            reset()
          }}
        >
          <CloseRoundedIcon />
        </IconButton>
      }
    >
      <div style={{ width: '80%', paddingBottom: '5px' }}>
        <div>{alertItem.type}</div>
        <Typography level="body-xs" color={alertItem.color}>
          {alert.message}
        </Typography>
        <div style={{ paddingTop: '5px' }}>
          <LinearProgress color={alertItem.color} size="sm" determinate value={Number(value)} />
        </div>
      </div>
    </Alert>
  )
}

export default AlertItem
