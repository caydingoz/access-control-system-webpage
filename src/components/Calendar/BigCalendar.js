import React, { useState, useEffect } from 'react'
import { Box, Typography, Sheet, Button, IconButton } from '@mui/joy'
import MonthCalendar from '../Calendar/MonthCalendar'
import WeekCalendar from '../Calendar/WeekCalendar'
import ActivityCalendarService from '../../services/ActivityCalendarService'
import AddIcon from '@mui/icons-material/Add'
import ActivityInfo from './ActivityInfo'

const BigCalendar = () => {
  const today = new Date()

  const [calendarType, setCalendarType] = useState('Month')
  const [currentDate, setCurrentDate] = useState(today)
  const [activities, setActivities] = useState([])
  const [workItems, setWorkItems] = useState([])
  const [visibleActivityInfo, setVisibleActivityInfo] = React.useState(false)

  useEffect(() => {
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()
    const daysInMonth = getDaysInMonth(currentMonth, currentYear)

    async function fetchData() {
      const activityRes = await ActivityCalendarService.getActivitiesAsync(
        new Date(currentYear, currentMonth, 1).toISOString(),
        new Date(currentYear, currentMonth, daysInMonth).toISOString(),
      )
      if (activityRes.success) {
        setActivities(activityRes.data.activities)
      }
      const workItemRes = await ActivityCalendarService.getUserWorkItemsAsync()
      if (workItemRes.success) {
        setWorkItems(workItemRes.data.workItems)
      }
    }
    fetchData()
  }, [currentDate])

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate()

  const handleUpdateActivity = async (activity) => {
    const res = await ActivityCalendarService.updateActivityAsync(activity)
    if (res.success) {
      const currentMonth = currentDate.getMonth()
      const currentYear = currentDate.getFullYear()
      const daysInMonth = getDaysInMonth(currentMonth, currentYear)
      const activityRes = await ActivityCalendarService.getActivitiesAsync(
        new Date(currentYear, currentMonth, 1).toISOString(),
        new Date(currentYear, currentMonth, daysInMonth).toISOString(),
      )
      if (activityRes.success) {
        setActivities(activityRes.data.activities)
      }
    }
  }

  const handleCreateActivity = async (activity) => {
    const res = await ActivityCalendarService.createActivityAsync(activity)
    if (res.success) {
      const currentMonth = currentDate.getMonth()
      const currentYear = currentDate.getFullYear()
      const daysInMonth = getDaysInMonth(currentMonth, currentYear)
      const activityRes = await ActivityCalendarService.getActivitiesAsync(
        new Date(currentYear, currentMonth, 1).toISOString(),
        new Date(currentYear, currentMonth, daysInMonth).toISOString(),
      )
      if (activityRes.success) {
        setActivities(activityRes.data.activities)
      }
    }
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
          <Button variant={calendarType === 'Month' ? 'solid' : 'outlined'} onClick={() => setCalendarType('Month')} sx={{ mr: 1 }}>
            Month
          </Button>
          <Button variant={calendarType === 'Week' ? 'solid' : 'outlined'} onClick={() => setCalendarType('Week')}>
            Week
          </Button>
        </Box>
      </Box>
      <Sheet
        variant="outlined"
        sx={{
          width: '96%',
          margin: '0% 2% 1% 2%',
          padding: '10px 20px 20px 20px',
          boxShadow: 'sm',
          borderRadius: 'sm',
          backgroundColor: 'transparent',
        }}
      >
        {calendarType === 'Month' ? (
          <MonthCalendar
            activities={activities}
            setActivities={setActivities}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            workItems={workItems}
            handleCreateActivity={handleCreateActivity}
            handleUpdateActivity={handleUpdateActivity}
          />
        ) : (
          <WeekCalendar
            activities={activities}
            setActivities={setActivities}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            workItems={workItems}
            handleCreateActivity={handleCreateActivity}
            handleUpdateActivity={handleUpdateActivity}
          />
        )}
      </Sheet>
      <IconButton
        sx={{
          position: 'fixed',
          display: 'flex',
          right: '10px',
          paddingBottom: '10px',
          bottom: '0',
          zIndex: 99999,
        }}
        variant="plain"
        color="neutral"
        onClick={() => setVisibleActivityInfo(true)}
        size="sm"
      >
        <AddIcon />
      </IconButton>
      {visibleActivityInfo && (
        <div className="overlay">
          <div style={{ width: 450 }}>
            <ActivityInfo
              activity={{
                startTime: new Date(new Date(currentDate).setHours(9, 0, 0, 0, 0)),
                endTime: new Date(new Date(currentDate).setHours(18, 0, 0, 0, 0)),
              }}
              isNew={true}
              onClose={() => setVisibleActivityInfo(false)}
              workItems={workItems}
              onSubmit={handleCreateActivity}
            />
          </div>
        </div>
      )}
    </Sheet>
  )
}

export default BigCalendar
