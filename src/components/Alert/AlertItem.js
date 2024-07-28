import React from 'react'
import Alert from '@mui/joy/Alert'
import IconButton from '@mui/joy/IconButton'
import Typography from '@mui/joy/Typography'
import LinearProgress from '@mui/joy/LinearProgress'
import { useDispatch } from 'react-redux'
import { hideAlert } from '../../slices/alertSlice'
import { useCountUp } from 'use-count-up'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

const AlertItem = ({ alert, alertItem }) => {
  const dispatch = useDispatch()
  const { value, reset } = useCountUp({
    isCounting: true,
    duration: 2,
    easing: 'linear',
    start: 0,
    end: 100,
    onComplete: () => {
      if (alert.alertType === 'Success') {
        dispatch(hideAlert(alert.id))
        reset()
      }
      return { shouldRepeat: false }
    },
  })

  return (
    <Alert
      sx={{ alignItems: 'flex-start', width: '100%', marginBottom: '10px' }}
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
        <Typography level="body-sm" color={alertItem.color}>
          {alert.message}
        </Typography>
        {alertItem.type !== 'Error' && (
          <div style={{ paddingTop: '5px' }}>
            <LinearProgress color={alertItem.color} size="sm" determinate value={Number(value)} />
          </div>
        )}
      </div>
    </Alert>
  )
}

export default AlertItem
