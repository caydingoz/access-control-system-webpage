import React from 'react'
import { Box, Typography, Grid, IconButton, Tooltip } from '@mui/joy'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

const MonthCalendar = ({ activities = [], setActivities, currentDate, setCurrentDate }) => {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  // Helper functions
  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (month, year) => {
    const firstDay = new Date(year, month, 1).getDay()
    return firstDay === 0 ? 6 : firstDay - 1
  }

  const handlePreviousMonth = () => {
    setActivities([])
    setCurrentDate((prevDate) => {
      const prevMonth = prevDate.getMonth() - 1
      return new Date(prevDate.getFullYear(), prevMonth, 1)
    })
  }
  const calculateDuration = (startTime, endTime) => {
    const start = new Date(startTime)
    const end = new Date(endTime)
    const diffMs = end - start // Difference in milliseconds

    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours}h ${minutes}m`
  }

  const handleNextMonth = () => {
    setActivities([])
    setCurrentDate((prevDate) => {
      const nextMonth = prevDate.getMonth() + 1
      return new Date(prevDate.getFullYear(), nextMonth, 1)
    })
  }

  // Variables for the current calendar
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  const daysInMonth = getDaysInMonth(currentMonth, currentYear)
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear)

  const renderActivitiesForDay = (day) => {
    const dayActivities = activities.filter((activity) => new Date(activity.startTime).getDate() === day)

    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflowY: 'auto',
          paddingTop: '5px',
          '::-webkit-scrollbar': {
            width: '4px',
          },
          '::-webkit-scrollbar-thumb': {
            backgroundColor: '#888',
            borderRadius: '4px',
          },
          '::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#555',
          },
          '::-webkit-scrollbar-track': {
            backgroundColor: '#f1f1f1',
            borderRadius: '4px',
          },
        }}
      >
        {dayActivities.map((activity, index) => (
          <Tooltip
            key={index}
            placement="right"
            variant="outlined"
            arrow
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
          >
            <Box
              key={index}
              sx={{
                width: '90%',
                backgroundColor: '#37AFE1',
                color: 'white',
                borderRadius: '5px',
                padding: '5px',
                marginBottom: '5px',
                textAlign: 'center',
                fontSize: '12px',
              }}
            >
              <Typography
                level="body-xs"
                sx={{
                  textAlign: 'center',
                  fontSize: '11px',
                  color: 'white',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 3, // Change this number to adjust how many lines to display
                }}
              >
                {activity.description}
              </Typography>
            </Box>
          </Tooltip>
        ))}
      </Box>
    )
  }

  const renderCalendarDays = () => {
    const daysArray = []
    const totalSlots = 42

    for (let i = 0; i < firstDayOfMonth; i++) {
      daysArray.push(
        <Box
          key={`empty-${i}`}
          sx={{
            position: 'relative',
            width: '100%',
            height: '120px',
            border: '1px solid #ddd',
          }}
        ></Box>,
      )
    }

    for (let day = 1; day <= daysInMonth; day++) {
      daysArray.push(
        <Box
          key={day}
          sx={{
            position: 'relative',
            width: '100%',
            height: '120px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '1px solid #ddd',
            cursor: 'pointer',
            ':hover': { backgroundColor: '#C0C0C0' },
            paddingTop: '25px',
            paddingBottom: '5px',
          }}
        >
          <Typography
            sx={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              fontSize: '12px',
              fontWeight: 'bold',
            }}
          >
            {day}
          </Typography>
          {renderActivitiesForDay(day)}
        </Box>,
      )
    }

    const totalFilledSlots = firstDayOfMonth + daysInMonth
    const remainingEmptySlots = totalSlots - totalFilledSlots

    for (let i = 0; i < remainingEmptySlots; i++) {
      daysArray.push(
        <Box
          key={`empty-after-${i}`}
          sx={{
            position: 'relative',
            width: '100%',
            height: '120px',
            border: '1px solid #ddd',
          }}
        ></Box>,
      )
    }

    return daysArray
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
        <IconButton variant="plain" color="neutral" onClick={handlePreviousMonth} size="sm">
          <ArrowBackIosNewIcon />
        </IconButton>
        <Typography level="title-lg" sx={{ fontWeight: 'bold' }}>
          {currentDate.toLocaleString('default', { month: 'long' })} {currentYear}
        </Typography>
        <IconButton variant="plain" color="neutral" onClick={handleNextMonth} size="sm">
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
      <Box>
        <Grid container sx={{ marginBottom: '10px', gap: 0 }}>
          {daysOfWeek.map((day) => (
            <Grid key={day} xs={1.71}>
              <Typography level="title-sm" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                {day}
              </Typography>
            </Grid>
          ))}
        </Grid>
        <Grid container sx={{ gap: 0 }}>
          {renderCalendarDays().map((dayElement, index) => (
            <Grid key={index} xs={1.71}>
              {dayElement}
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  )
}

export default MonthCalendar
