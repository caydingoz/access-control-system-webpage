import React, { useState, useEffect } from 'react'
import { Box, Typography, Sheet, Button } from '@mui/joy'
import { IconButton as RsuiteIconButton } from 'rsuite'
import MonthCalendar from './MonthCalendar'
import WeekCalendar from './WeekCalendar'
import ActivityCalendarService from '../../services/ActivityCalendarService'
import PlusIcon from '@rsuite/icons/Plus'
import ActivityInfo from './ActivityInfo'
import { useSelector } from 'react-redux'
import PermissionChecker from '../../helpers/permissionChecker'
import { PermissionTypes } from '../../enums/PermissionTypes'

const BigCalendar = () => {
  const userPermissions = useSelector((state) => state.auth.permissions)
  const today = new Date()

  const [calendarType, setCalendarType] = useState('Month')
  const [currentDate, setCurrentDate] = useState(today)
  const [activities, setActivities] = useState([])
  const [workItems, setWorkItems] = useState([])
  const [selectedDate, setSelectedDate] = React.useState(currentDate)
  const [selectedActivityId, setSelectedActivityId] = React.useState(null)
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

  const openUpdateActivity = (activityId) => {
    setSelectedActivityId(activityId)
    setVisibleActivityInfo(true)
  }
  const openCreateActivity = (date) => {
    setSelectedActivityId(null)
    setSelectedDate(date)
    setVisibleActivityInfo(true)
  }

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
    setVisibleActivityInfo(false)
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
    setVisibleActivityInfo(false)
  }

  const handleDeleteActivity = async (id) => {
    const res = await ActivityCalendarService.deleteActivityByIdAsync(id)
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
    setVisibleActivityInfo(false)
  }

  return (
    <Sheet variant="outlined" sx={{ width: '100%', borderRadius: 'sm', backgroundColor: 'transparent' }}>
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
      <div style={{ padding: '0.5% 0% 0.5% 2%' }}>
        {PermissionChecker.hasPermission(userPermissions, 'ActivityCalendar', PermissionTypes.Create) && (
          <RsuiteIconButton
            appearance="primary"
            icon={<PlusIcon />}
            color="green"
            size="xs"
            style={{
              width: '120px',
              fontSize: '13px',
              marginRight: '2%',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.01)'
              e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 128, 0, 0.3)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = 'none'
            }}
            onClick={() => openCreateActivity(new Date(today))}
          >
            Add Activity
          </RsuiteIconButton>
        )}
      </div>
      <Sheet
        variant="outlined"
        sx={{
          width: '96%',
          margin: '1% 2% 1% 2%',
          padding: '10px 20px 20px 20px',
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
            openUpdateActivity={openUpdateActivity}
            openCreateActivity={openCreateActivity}
          />
        ) : (
          <WeekCalendar
            activities={activities}
            setActivities={setActivities}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            openUpdateActivity={openUpdateActivity}
          />
        )}
      </Sheet>
      {visibleActivityInfo && (
        <div className="overlay">
          <div style={{ width: 450 }}>
            <ActivityInfo
              activity={
                activities.find((activity) => activity.id === selectedActivityId) ?? {
                  startTime: new Date(new Date(selectedDate).setHours(9, 0, 0, 0, 0)),
                  endTime: new Date(new Date(selectedDate).setHours(18, 0, 0, 0, 0)),
                }
              }
              isNew={selectedActivityId === null}
              onClose={() => setVisibleActivityInfo(false)}
              workItems={workItems}
              onSubmit={selectedActivityId === null ? handleCreateActivity : handleUpdateActivity}
              onDelete={handleDeleteActivity}
            />
          </div>
        </div>
      )}
    </Sheet>
  )
}

export default BigCalendar
