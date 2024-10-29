import React from 'react'
import { useSelector } from 'react-redux'
import { Box, Typography, Table, IconButton, Tooltip } from '@mui/joy'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ActivityDetail from './ActivityDetail'

const WeekCalendar = ({ activities = [], setActivities, currentDate, setCurrentDate, openUpdateActivity }) => {
  const theme = useSelector((state) => state.rSuiteTheme.themeMode)

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const hours = Array.from({ length: 24 }, (_, i) => `${i < 10 ? '0' : ''}${i}:00`)

  const layerColors = ['#D3F7FC', '#A5F1DB', '#D0F5BE', '#FBFFDC']
  const borderColors = ['#54B8C0', '#6CBF9E', '#A5C98D', '#D4DBA4']
  const layerColorsDark = ['#142850', '#27496D', '#0C7B93', '#00A8CC'] //dark mode
  const borderColorsDark = ['#C53C3D', '#D76B30', '#FFD460', '#FFE080'] //dark mode ['#4B6B9A', '#6E8BAD', '#66B8D0', '#99D7EA']

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
          title={<ActivityDetail activity={activity} />}
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
              right: '2px',
              paddingTop: '2px',
              paddingLeft: '5px',
              paddingRight: '3px',
              bottom: `${differenceInHours * -40 + 2}px`,
              cursor: 'pointer',
            }}
            onClick={() => {
              openUpdateActivity(activity.id)
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
        size="md"
        variant="outlined"
        borderAxis="both"
        sx={{
          boxShadow: 'sm',
          width: '100%',
          '& thead th:nth-of-type(1)': {
            width: '100px',
          },
          '& tbody tr': {
            height: '40px',
          },
          '& tbody td:hover': {
            backgroundColor: (theme) => theme.vars.palette.primary.softBg, // Hover arka plan rengi
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
