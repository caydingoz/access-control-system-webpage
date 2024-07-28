import InfoIcon from '@mui/icons-material/Info'
import WarningIcon from '@mui/icons-material/Warning'
import ReportIcon from '@mui/icons-material/Report'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import * as React from 'react'
import Box from '@mui/joy/Box'
import { useSelector } from 'react-redux'
import AlertItem from './AlertItem'

export default function AlertVariousStates() {
  const alerts = useSelector((state) => state.alert.alerts)
  const basedItems = [
    { type: 'Success', color: 'success', icon: <CheckCircleIcon /> },
    { type: 'Warning', color: 'warning', icon: <WarningIcon /> },
    { type: 'Error', color: 'danger', icon: <ReportIcon /> },
    { type: 'Neutral', color: 'neutral', icon: <InfoIcon /> },
  ]

  return (
    <Box
      sx={{
        position: 'fixed',
        display: 'flex',
        width: '25%',
        flexDirection: 'column',
        alignItems: 'flex-end',
        right: '10px',
        bottom: '0',
        zIndex: 9999,
      }}
    >
      {alerts.map((alert) => {
        const alertItem = basedItems.find((item) => item.type === alert.alertType)
        return <AlertItem key={alert.id} alert={alert} alertItem={alertItem} />
      })}
    </Box>
  )
}
