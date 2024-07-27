import InfoIcon from '@mui/icons-material/Info'
import WarningIcon from '@mui/icons-material/Warning'
import ReportIcon from '@mui/icons-material/Report'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import * as React from 'react'
import Box from '@mui/joy/Box'
import Alert from '@mui/joy/Alert'
import IconButton from '@mui/joy/IconButton'
import Typography from '@mui/joy/Typography'
import { useSelector, useDispatch } from 'react-redux'
import { hideAlert } from '../slices/alertSlice'
import LinearProgress from '@mui/joy/LinearProgress'
import { useCountUp } from 'use-count-up'

export default function AlertVariousStates() {
  const dispatch = useDispatch()
  const { visible, message, alertType } = useSelector((state) => state.alert)
  const basedItems = [
    { type: 'Success', color: 'success', icon: <CheckCircleIcon /> },
    { type: 'Warning', color: 'warning', icon: <WarningIcon /> },
    { type: 'Error', color: 'danger', icon: <ReportIcon /> },
    { type: 'Neutral', color: 'neutral', icon: <InfoIcon /> },
  ]

  const { value, reset } = useCountUp({
    isCounting: visible,
    duration: 3,
    easing: 'linear',
    start: 0,
    end: 100,
    onComplete: () => {
      if (alertItem.type === 'Success') {
        dispatch(hideAlert())
        reset()
      }
      return { shouldRepeat: false }
    },
  })

  const alertItem = basedItems.find((item) => item.type === alertType)

  return (
    <div className="fixed-bottom">
      {visible && (
        <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column', alignItems: 'flex-end', padding: '15px' }}>
          {alertItem ? (
            <Alert
              sx={{ alignItems: 'flex-start', width: '25%' }}
              startDecorator={alertItem.icon}
              variant="soft"
              color={alertItem.color}
              endDecorator={
                <IconButton
                  size="sm"
                  variant="soft"
                  color={alertItem.color}
                  onClick={() => {
                    dispatch(hideAlert())
                    reset()
                  }}
                >
                  <CloseRoundedIcon />
                </IconButton>
              }
            >
              <div style={{ width: '80%' }}>
                <div>{alertItem.type}</div>
                <Typography level="body-sm" color={alertItem.color}>
                  {message}
                </Typography>
                <div style={{ paddingTop: '10px' }}>
                  <LinearProgress color={alertItem.color} size="sm" determinate value={Number(value)} />
                </div>
              </div>
            </Alert>
          ) : (
            <div>Alert type not found!</div>
          )}
        </Box>
      )}
    </div>
  )
}
