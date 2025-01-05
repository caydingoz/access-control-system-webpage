import React from 'react'
import { useSelector } from 'react-redux'
import { Box, Typography, Grid, IconButton, Tooltip } from '@mui/joy'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ActivityDetail from './ActivityDetail'
import 'src/css/style.css'
import PermissionChecker from '../../helpers/permissionChecker'
import { PermissionTypes } from '../../enums/PermissionTypes'

const MonthCalendar = ({ activities = [], setActivities, currentDate, setCurrentDate, openUpdateActivity, openCreateActivity }) => {
  const userPermissions = useSelector((state) => state.auth.permissions)
  const theme = useSelector((state) => state.rSuiteTheme.themeMode)

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (month, year) => {
    const firstDay = new Date(year, month, 1).getDay()
    return firstDay === 0 ? 6 : firstDay - 1
  }

  const daysInMonth = getDaysInMonth(currentMonth, currentYear)
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear)

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

  const renderActivitiesForDay = (day) => {
    const dayActivities = activities.filter(
      (activity) => new Date(activity.startTime).getDate() <= day && new Date(activity.endTime).getDate() >= day,
    )

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
                backgroundColor: theme === 'dark' ? '#0C7B93' : '#B1AFFF',
                borderRadius: '5px',
                padding: '5px',
                marginBottom: '5px',
                textAlign: 'center',
                fontSize: '12px',
              }}
              onClick={(e) => {
                e.stopPropagation() //Gün kutusuna tıklamayı durdurur
                if (PermissionChecker.hasPermission(userPermissions, 'Activity', PermissionTypes.Write)) {
                  openUpdateActivity(activity.id)
                }
              }}
            >
              <Typography
                level="body-xs"
                sx={{
                  textAlign: 'center',
                  color: 'white',
                  fontSize: '11px',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 3, //Change this number to adjust how many lines to display
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

    // Önceki ayın günlerini ekleyin
    for (let i = 0; i < firstDayOfMonth; i++) {
      const previousMonthDay = getDaysInMonth(currentMonth - 1, currentYear) - (firstDayOfMonth - i - 1)
      daysArray.push(
        <Box
          key={`empty-${i}`}
          sx={{
            position: 'relative',
            width: '100%',
            height: '100px',
            border: '1px solid #ddd',
            opacity: 0.5,
          }}
        >
          <Typography
            sx={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              fontSize: '12px',
              fontWeight: 'bold',
              color: theme === 'dark' ? '#ccc' : '#666',
            }}
          >
            {previousMonthDay}
          </Typography>
        </Box>,
      )
    }

    // Mevcut ayın günlerini ekleyin
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
            backgroundColor: theme === 'dark' ? '#181a20' : '#fafcff',
            ':hover': { backgroundColor: (theme) => theme.vars.palette.primary.softBg },
            paddingTop: '25px',
            paddingBottom: '5px',
            zIndex: '8',
          }}
          onClick={() => {
            if (PermissionChecker.hasPermission(userPermissions, 'Activity', PermissionTypes.Write)) {
              openCreateActivity(fullDate)
            }
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

    // Sonraki ayın boş günlerini ekleyin
    const totalFilledSlots = firstDayOfMonth + daysInMonth
    const remainingEmptySlots = totalSlots - totalFilledSlots

    for (let i = 0; i < remainingEmptySlots; i++) {
      const nextMonthDay = i + 1 // Sonraki ayın günleri
      daysArray.push(
        <Box
          key={`empty-after-${i}`}
          sx={{
            position: 'relative',
            width: '100%',
            height: '100px',
            border: '1px solid #ddd',
            opacity: 0.5,
          }}
        >
          <Typography
            sx={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              fontSize: '12px',
              fontWeight: 'bold',
              color: theme === 'dark' ? '#ccc' : '#666',
            }}
          >
            {nextMonthDay}
          </Typography>
        </Box>,
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
    </div>
  )
}

export default MonthCalendar
