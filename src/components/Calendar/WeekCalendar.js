import React from 'react'
import { Box, Typography, Table, Sheet, IconButton, Tooltip } from '@mui/joy'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'

const WeekCalendar = ({ activities = [], setActivities, currentDate, setCurrentDate }) => {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`)

  // Haftanın başlangıç tarihi
  const startOfWeek = () => {
    const firstDay = new Date(currentDate)
    const dayOfWeek = firstDay.getUTCDay() || 7 // Sunday = 0, so we need to adjust
    firstDay.setUTCDate(firstDay.getUTCDate() - dayOfWeek + 1) // Monday as first day of week
    return firstDay
  }

  // Tarihleri güncelleme fonksiyonu
  const changeWeek = (increment) => {
    setActivities([]) // Yeni hafta gösterildiğinde aktiviteleri sıfırlıyoruz
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

  // Belirli bir saat dilimine uygun aktiviteleri döndüren fonksiyon
  const renderActivitiesForTimeSlot = (day, hour) => {
    const start = startOfWeek()
    start.setDate(start.getDate() + daysOfWeek.indexOf(day)) // İlgili günü ayarlıyoruz

    const filteredActivities = activities.filter((activity) => {
      const activityStart = new Date(activity.startTime)
      const activityEnd = new Date(activity.endTime)
      return (
        activityStart.getDate() === start.getDate() &&
        activityStart.getMonth() === start.getMonth() &&
        activityStart.getFullYear() === start.getFullYear() &&
        activityStart.getHours() <= parseInt(hour) &&
        activityEnd.getHours() >= parseInt(hour)
      )
    })

    return filteredActivities.map((activity, index) => (
      <Tooltip
        key={index}
        title={
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ fontSize: 'sm', fontWeight: 'bold' }}>{activity.workItem.title}</Typography>
            <Typography sx={{ fontSize: 'sm' }}>{activity.description}</Typography>
            <Typography sx={{ fontSize: 'sm' }}>
              {`Start: ${new Date(activity.startTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}`}
            </Typography>
            <Typography sx={{ fontSize: 'sm' }}>
              {`End: ${new Date(activity.endTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}`}
            </Typography>
          </Box>
        }
      >
        <Box
          sx={{
            backgroundColor: '#3d99f5',
            color: 'white',
            borderRadius: '5px',
            padding: '5px',
            marginBottom: '5px',
            textAlign: 'center',
            fontSize: '12px',
          }}
        >
          {activity.description}
        </Box>
      </Tooltip>
    ))
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
        }}
      >
        <thead>
          <tr>
            <th />
            {daysOfWeek.map((day, index) => {
              const date = new Date(startOfWeek())
              date.setDate(date.getDate() + index)
              const formattedDate = `${day} (${formatHeaderDate(date)})`
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
                <td key={`${hour}-${day}`} style={{ position: 'relative', verticalAlign: 'top' }}>
                  {renderActivitiesForTimeSlot(day, hour)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </Sheet>
  )
}

export default WeekCalendar
