import React, { useState } from 'react'
import { Box, Typography, Grid, IconButton, Sheet, Button } from '@mui/joy'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import MonthCalendar from '../Calendar/MonthCalendar'
import WeekCalendar from '../Calendar/WeekCalendar'

const BigCalendar = () => {
  const today = new Date()
  const [currentDate, setCurrentDate] = useState(today)

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] // Günleri düzenledik
  const [calendarType, setCalendarType] = useState('Month')
  const handleButtonClick = (type) => {
    setCalendarType(type)
  }
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
    <Sheet variant="outlined" sx={{ width: '100%', boxShadow: 'sm', borderRadius: 'sm', backgroundColor: 'transparent' }}>
      <Box
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '1%',
          borderTopLeftRadius: 'var(--unstable_actionRadius)',
          borderTopRightRadius: 'var(--unstable_actionRadius)',
        }}
      >
        <Typography level="title-lg" sx={{ flex: '1 1 100%', fontWeight: 'bold' }}>
          Activity Calendar
          <br />
          <Typography level="body-xs" sx={{ fontWeight: 'normal' }}>
            The Activity Calendar allows users to log and track their daily tasks efficiently.
          </Typography>
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', flex: '0 0 auto' }}>
          <Button variant={calendarType === 'Month' ? 'solid' : 'outlined'} onClick={() => handleButtonClick('Month')} sx={{ mr: 1 }}>
            Month
          </Button>
          <Button variant={calendarType === 'Week' ? 'solid' : 'outlined'} onClick={() => handleButtonClick('Week')}>
            Week
          </Button>
        </Box>
      </Box>
      {calendarType === 'Month' ? <MonthCalendar /> : <WeekCalendar />}
    </Sheet>
  )
}

export default BigCalendar
