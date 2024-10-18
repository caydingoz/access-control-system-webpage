import React, { useState } from 'react'
import { Box, Typography, Table, Sheet, IconButton } from '@mui/joy'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'

const WeekCalendar = () => {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`)

  const [currentDate, setCurrentDate] = useState(new Date())

  // Haftanın başlangıç tarihi
  const startOfWeek = () => {
    const firstDay = new Date(currentDate)
    const dayOfWeek = firstDay.getUTCDay() || 7 // Sunday = 0, so we need to adjust
    firstDay.setUTCDate(firstDay.getUTCDate() - dayOfWeek + 1) // Monday as first day of week
    return firstDay
  }

  // Tarihleri güncelleme fonksiyonu
  const changeWeek = (increment) => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + increment * 7)))
  }

  // Yılı ve tarihi formatlayarak döndüren fonksiyon
  const formatHeaderDate = (date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0') // Aylar 0-11 aralığında
    const day = String(date.getDate()).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  // Dinamik tarih aralığını formatlayarak döndüren fonksiyon
  const formatDateRange = () => {
    const start = startOfWeek()
    const end = new Date(start)
    end.setDate(start.getDate() + 6) // Haftanın sonuna ekleyerek
    return `${formatHeaderDate(start)} - ${formatHeaderDate(end)}`
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
        <IconButton variant="plain" color="neutral" onClick={() => changeWeek(-1)} size="sm">
          <ArrowBackIosNewIcon />
        </IconButton>
        <Typography level="title-lg" sx={{ fontWeight: 'bold' }}>
          {formatDateRange()} {/* Dinamik tarih aralığını burada gösteriyoruz */}
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
        }}
      >
        <thead>
          <tr>
            <th />
            {daysOfWeek.map((day, index) => {
              const date = new Date(startOfWeek())
              date.setDate(date.getDate() + index) // Günleri ayarlıyoruz
              const formattedDate = `${day} (${formatHeaderDate(date)})` // Gün, Ay/Yıl formatında
              return <th key={day}>{formattedDate}</th>
            })}
          </tr>
        </thead>
        <tbody>
          {hours.map((hour) => (
            <tr key={hour}>
              <th scope="row" style={{ textAlign: 'center' }}>
                {hour}
              </th>
              {daysOfWeek.map((day) => (
                <td key={`${hour}-${day}`}>&nbsp;</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </Sheet>
  )
}

export default WeekCalendar
