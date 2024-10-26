import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Box, Typography, Table, IconButton, Tooltip } from '@mui/joy'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'

const WeekCalendar = ({ activities = [], setActivities, currentDate, setCurrentDate }) => {
  const theme = useSelector((state) => state.rSuiteTheme.themeMode)

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const hours = Array.from({ length: 24 }, (_, i) => `${i < 10 ? '0' : ''}${i}:00`)

  const layerColors = ['#D3F7FC', '#A5F1DB', '#D0F5BE', '#FBFFDC']
  const borderColors = ['#54B8C0', '#6CBF9E', '#A5C98D', '#D4DBA4']
  const layerColorsDark = ['#142850', '#27496D', '#0C7B93', '#00A8CC'] //dark mode
  const borderColorsDark = ['#C53C3D', '#D76B30', '#FFD460', '#FFE080'] //dark mode

  const startOfWeek = () => {
    const firstDay = new Date(currentDate)
    const dayOfWeek = firstDay.getUTCDay() || 7 // Sunday = 0
    firstDay.setUTCDate(firstDay.getUTCDate() - dayOfWeek + 1) // Monday as first day of week
    return firstDay
  }

  const changeWeek = (increment) => {
    setActivities([]) // Yeni hafta gösterildiğinde aktiviteleri sıfırlıyoruz
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + increment * 7)))
  }

  const calculateDuration = (startTime, endTime) => {
    const diffMs = new Date(endTime) - new Date(startTime)
    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  const formatHeaderDate = (date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0') // Aylar 0-11 aralığında
    const day = String(date.getDate()).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const formatDateRange = () => {
    const start = startOfWeek()
    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    return `${formatHeaderDate(start)} - ${formatHeaderDate(end)}`
  }

  const renderActivitiesForTimeSlot = (day, hour) => {
    const start = startOfWeek()
    start.setDate(start.getDate() + daysOfWeek.indexOf(day))

    const filteredActivities = activities.filter((activity) => {
      const activityStart = new Date(activity.startTime)
      return (
        activityStart.getDate() === start.getDate() &&
        activityStart.getMonth() === start.getMonth() &&
        activityStart.getFullYear() === start.getFullYear() &&
        activityStart.getHours() === parseInt(hour)
      )
    })

    return filteredActivities.map((activity, index) => {
      const startTime = new Date(activity.startTime)
      const endTime = new Date(activity.endTime)
      const differenceInHours = endTime.getHours() - startTime.getHours() - 1
      const startTimeHours = startTime.getHours().toString().padStart(2, '0')
      const startTimeMinutes = startTime.getMinutes().toString().padStart(2, '0')
      const endTimeHours = endTime.getHours().toString().padStart(2, '0')
      const endTimeMinutes = endTime.getMinutes().toString().padStart(2, '0')

      return (
        <Tooltip
          key={index}
          sx={{
            backgroundColor: '#f5f5f5',
          }}
          title={
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
          }
          arrow
          placement="right-start"
        >
          <Box
            sx={{
              backgroundColor: theme === 'dark' ? layerColorsDark[activity.layer] : layerColors[activity.layer],
              color: 'white',
              borderRadius: '2px',
              textAlign: 'center',
              fontSize: '12px',
              position: 'absolute',
              borderLeft: `3.5px solid ${theme === 'dark' ? borderColorsDark[activity.layer] : borderColors[activity.layer]}`,
              zIndex: 2,
              top: '0px',
              left: `${activity.layer * 6}px`,
              right: '4px',
              paddingTop: '2px',
              paddingLeft: '5px',
              paddingRight: '3px',
              bottom: `${differenceInHours * -40 + 2}px`,
            }}
          >
            <Typography
              level="body-xs"
              sx={{
                textAlign: 'left',
                fontSize: '11px',
                color: theme === 'dark' ? 'white' : '#767879',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 1, // Change this number to adjust how many lines to display
              }}
            >
              {activity.description}
            </Typography>
            <Typography
              level="body-xs"
              color="white"
              sx={{
                textAlign: 'left',
                fontWeight: 'normal',
                fontSize: '10px',
                color: theme === 'dark' ? 'white' : '#767879',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 1, // Change this number to adjust how many lines to display
              }}
            >
              {`${startTimeHours}:${startTimeMinutes} - ${endTimeHours}:${endTimeMinutes}`}
            </Typography>
          </Box>
        </Tooltip>
      )
    })
  }

  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px',
        }}
      >
        <IconButton variant="plain" color="neutral" onClick={() => changeWeek(-1)} size="sm">
          <ArrowBackIosNewIcon />
        </IconButton>
        <Typography level="title-lg" sx={{ fontWeight: 'bold' }}>
          {formatDateRange()}
        </Typography>
        <IconButton variant="plain" color="neutral" onClick={() => changeWeek(1)} size="sm">
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
      <Table
        hoverRow
        size="md"
        variant="outlined"
        borderAxis="both"
        sx={{
          boxShadow: 'sm',
          width: '100%',
          '--TableCell-selectedBackground': (theme) => theme.vars.palette.primary.softBg,
          '& thead th:nth-of-type(1)': {
            width: '100px',
          },
          '& tbody tr': {
            height: '40px',
          },
        }}
      >
        <thead>
          <tr>
            <th />
            {daysOfWeek.map((day, index) => {
              const date = new Date(startOfWeek())
              date.setDate(date.getDate() + index)
              const formattedDate = `${day} (${formatHeaderDate(date)})`
              return (
                <th key={day}>
                  <Typography
                    level="title-sm"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      textAlign: 'center',
                    }}
                  >
                    {formattedDate}
                  </Typography>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {hours.map((hour) => (
            <tr key={hour}>
              <th scope="row" style={{ textAlign: 'center' }}>
                <Typography level="body-sm">{hour}</Typography>
              </th>
              {daysOfWeek.map((day) => (
                <td key={`${hour}-${day}`} style={{ position: 'relative', verticalAlign: 'top' }}>
                  {renderActivitiesForTimeSlot(day, hour)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default WeekCalendar
