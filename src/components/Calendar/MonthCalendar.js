import React, { useState } from 'react'
import { Box, Typography, Grid, IconButton, Sheet } from '@mui/joy'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

const MonthCalendar = () => {
  const today = new Date()
  const [currentDate, setCurrentDate] = useState(today)

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] // Günleri düzenledik

  // Helper functions
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month, year) => {
    const firstDay = new Date(year, month, 1).getDay()
    // Eğer gün Pazar (0) ise onu haftanın sonuna koymak için 6'ya çeviriyoruz
    return firstDay === 0 ? 6 : firstDay - 1
  }

  const handlePreviousMonth = () => {
    setCurrentDate((prevDate) => {
      const prevMonth = prevDate.getMonth() - 1
      return new Date(prevDate.getFullYear(), prevMonth, 1)
    })
  }

  const handleNextMonth = () => {
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

  const renderCalendarDays = () => {
    const daysArray = []
    const totalSlots = 42 // 6 weeks * 7 days

    // Empty slots before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      daysArray.push(
        <Box
          key={`empty-${i}`}
          sx={{
            position: 'relative',
            width: '100%',
            height: '100px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '1px solid #ddd',
          }}
        ></Box>,
      )
    }

    // Actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
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
            ':hover': { backgroundColor: '#C0C0C0' },
          }}
        >
          <Typography
            level="body2"
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
        </Box>,
      )
    }

    // Empty slots after the last day of the month
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
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '1px solid #ddd',
          }}
        ></Box>,
      )
    }

    return daysArray
  }

  return (
    <Sheet
      variant="outlined"
      sx={{
        width: '96%',
        margin: '1% 2%',
        padding: '15px 20px',
        boxShadow: 'sm',
        borderRadius: 'sm',
        backgroundColor: 'transparent',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '15px',
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
    </Sheet>
  )
}

export default MonthCalendar
