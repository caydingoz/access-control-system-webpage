import React, { useEffect } from 'react'
import { Box, Typography, Grid, IconButton, Tooltip } from '@mui/joy'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ActivityInfo from './ActivityInfo'
import ActivityDetail from './ActivityDetail'
import 'src/css/style.css'

const MonthCalendar = ({ activities = [], setActivities, currentDate, setCurrentDate, workItems, handleCreateActivity, handleUpdateActivity }) => {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const [visibleActivityInfo, setVisibleActivityInfo] = React.useState(false)
  const [selectedActivityId, setSelectedActivityId] = React.useState(null)
  const [selectedDate, setSelectedDate] = React.useState(null)
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (month, year) => {
    const firstDay = new Date(year, month, 1).getDay()
    return firstDay === 0 ? 6 : firstDay - 1
  }

  const daysInMonth = getDaysInMonth(currentMonth, currentYear)
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear)

  const openUpdateActivity = (activityId) => {
    setSelectedActivityId(activityId)
    setVisibleActivityInfo(true)
  }

  const openCreateActivity = (date) => {
    setSelectedActivityId(null)
    setSelectedDate(date)
    setVisibleActivityInfo(true)
  }

  const handlePreviousMonth = () => {
    setActivities([])
    setCurrentDate((prevDate) => {
      const prevMonth = prevDate.getMonth() - 1
      return new Date(prevDate.getFullYear(), prevMonth, 1)
    })
  }

  const handleNextMonth = () => {
    setActivities([])
    setCurrentDate((prevDate) => {
      const nextMonth = prevDate.getMonth() + 1
      return new Date(prevDate.getFullYear(), nextMonth, 1)
    })
  }

  useEffect(() => {
    //hide scroll when update model opened
    if (visibleActivityInfo) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [visibleActivityInfo])

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
          paddingTop: '1px',
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
          zIndex: '10',
        }}
      >
        {dayActivities.map((activity, index) => (
          <Tooltip key={index} placement="right" variant="outlined" arrow title={<ActivityDetail activity={activity} />}>
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
              onClick={(e) => {
                e.stopPropagation() // Gün kutusuna tıklamayı durdurur
                openUpdateActivity(activity.id)
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
            height: '100px',
            border: '1px solid #ddd',
          }}
        />,
      )
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const fullDate = new Date(currentYear, currentMonth, day)
      daysArray.push(
        <Box
          key={day}
          sx={{
            position: 'relative',
            width: '100%',
            height: '100px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '1px solid #ddd',
            cursor: 'pointer',
            ':hover': { backgroundColor: (theme) => theme.vars.palette.primary.softBg },
            paddingTop: '25px',
            paddingBottom: '5px',
            zIndex: '8',
          }}
          onClick={() => openCreateActivity(fullDate)}
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
            height: '100px',
            border: '1px solid #ddd',
          }}
        />,
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
        <IconButton variant="plain" color="neutral" onClick={() => handlePreviousMonth()} size="sm">
          <ArrowBackIosNewIcon />
        </IconButton>
        <Typography level="title-lg" sx={{ fontWeight: 'bold' }}>
          {currentDate.toLocaleString('default', { month: 'long' })} {currentYear}
        </Typography>
        <IconButton variant="plain" color="neutral" onClick={() => handleNextMonth()} size="sm">
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
      {visibleActivityInfo && (
        <div className="overlay">
          <div style={{ width: 450 }}>
            <ActivityInfo
              activity={activities.find((activity) => activity.id === selectedActivityId)}
              isNew={selectedActivityId === null ? true : false}
              onClose={() => setVisibleActivityInfo(false)}
              workItems={workItems}
              onSubmit={selectedActivityId === null ? handleCreateActivity : handleUpdateActivity}
              selectedDate={selectedDate}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default MonthCalendar
