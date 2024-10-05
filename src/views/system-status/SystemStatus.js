import React, { useEffect } from 'react'
import { cilCheckCircle, cilWarning, cilXCircle } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { Box, Typography, Grid, Chip, Divider } from '@mui/joy'
import ServiceStatusService from 'src/services/ServiceStatusService'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'

const SystemStatus = () => {
  const [serviceStatuses, setServiceStatuses] = React.useState([])
  const [mainStatus, setMainStatus] = React.useState('')

  useEffect(() => {
    const Status = {
      ALLALIVE: { icon: cilCheckCircle, text: 'All systems are operational', color: 'green' },
      SOMEDOWN: { icon: cilWarning, text: 'Some services are down', color: 'yellow' },
      ALLDOWN: { icon: cilXCircle, text: 'All services are down', color: 'red' },
    }
    async function fetchData() {
      const res = await ServiceStatusService.getServiceStatusAsync()
      if (res.success) {
        const services = res.data.services
        setServiceStatuses(services)
        const downServicesCount = services.filter((service) => !service.isAlive).length
        setMainStatus(downServicesCount === services.length ? Status.ALLDOWN : downServicesCount > 0 ? Status.SOMEDOWN : Status.ALLALIVE)
      }
    }

    fetchData()
  }, [])

  return (
    <div>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 6,
        }}
      >
        <CIcon icon={mainStatus.icon} size="8xl" style={{ color: mainStatus.color }} />
        <Typography level="h4" sx={{ marginTop: 3 }}>
          {mainStatus.text}
        </Typography>
      </Box>
      <Box sx={{ width: '100%', p: 2, border: '1px solid #e0e0e0', borderRadius: '8px', marginTop: 10 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: '1px solid #e0e0e0',
            paddingBottom: 2,
          }}
        >
          <Typography level="body-md">Current Status by Service</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip color="success" variant="outlined" startDecorator={<CheckCircleIcon />}>
              No Issues
            </Chip>
            <Chip color="primary" variant="outlined" startDecorator={<span>🔧</span>}>
              Maintenance
            </Chip>
            <Chip color="warning" variant="outlined" startDecorator={<span>⚠️</span>}>
              Incident
            </Chip>
            <Chip color="danger" variant="outlined" startDecorator={<ErrorIcon />}>
              Outage
            </Chip>
          </Box>
        </Box>
        <Grid container spacing={5} sx={{ p: 2 }}>
          {serviceStatuses.length > 0 ? (
            serviceStatuses.map((serviceStatus, index) => (
              <React.Fragment key={index}>
                <Grid item="true" xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography level="title-md">{serviceStatus.name}</Typography>
                      <Typography level="body-md">{serviceStatus.isAlive ? 'No issues' : serviceStatus.errorMessage}</Typography>
                    </Box>
                    {serviceStatus.isAlive ? <CheckCircleIcon sx={{ color: 'green' }} /> : <ErrorIcon sx={{ color: 'red' }} />}
                  </Box>
                </Grid>
                {/* Add Divider after every two items */}
                {(index + 1) % 2 === 0 && index !== serviceStatuses.length - 1 && <Divider sx={{ bgcolor: 'gray', width: '100%' }} />}
              </React.Fragment>
            ))
          ) : (
            <Grid item="true" xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography level="title-md">Health Check Error!</Typography>
                  <Typography level="body-md">Contact with Administrator</Typography>
                </Box>
                <ErrorIcon sx={{ color: 'red' }} />
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    </div>
  )
}

export default SystemStatus
