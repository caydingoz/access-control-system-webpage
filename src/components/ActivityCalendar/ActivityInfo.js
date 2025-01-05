import React from 'react'
import { Typography, Stack, Card } from '@mui/joy'
import { Input, InputGroup, SelectPicker, DatePicker } from 'rsuite'
import { IconButton as RsuiteIconButton, Button as RsuiteButton } from 'rsuite'
import RsuiteCloseIcon from '@rsuite/icons/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import 'src/css/style.css'
import { useSelector } from 'react-redux'
import { PermissionTypes } from '../../enums/PermissionTypes'
import PermissionChecker from '../../helpers/permissionChecker'

export default function ActivityInfo({ activity = {}, workItems = [], isNew, onSubmit, onClose, onDelete }) {
  const userPermissions = useSelector((state) => state.auth.permissions)
  const [activityInfo, setActivityInfo] = React.useState({
    id: activity.id || '',
    description: activity.description || '',
    workItemId: activity.workItemId || '',
    startTime: activity.startTime || '',
    endTime: activity.endTime || '',
  })
  const workItemsData = workItems.map((item) => ({ label: item.title, value: item.id }))

  const handleInputChange = (key, value) => {
    setActivityInfo({
      ...activityInfo,
      [key]: value,
    })
  }

  return (
    <Card
      sx={{
        width: '100%',
      }}
    >
      <Stack spacing={3}>
        <Stack
          direction="row"
          sx={{
            justifyContent: 'space-between',
            pb: 2,
            borderBottom: '2px solid #f1f5f9',
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Stack>
              <Typography
                level="h4"
                sx={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: isNew ? '#059669' : '#2563eb',
                  mb: 0.5,
                }}
              >
                {isNew ? 'New Activity' : 'Update Activity'}
              </Typography>
              <Typography
                level="body-xs"
                sx={{
                  color: '#64748b',
                  fontSize: '0.85rem',
                }}
              >
                {isNew
                  ? 'Please fill in the fields below to create a new activity.'
                  : 'Update the necessary details below to modify the activity information.'}
              </Typography>
            </Stack>
          </Stack>
          <RsuiteIconButton
            size="sm"
            appearance="subtle"
            onClick={onClose}
            icon={<RsuiteCloseIcon style={{ fontSize: '16px' }} />}
            style={{
              width: '32px',
              height: '32px',
              background: 'rgba(255, 59, 48, 0.08)',
              color: '#ff3b30',
              borderRadius: '10px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#ff3b30'
              e.currentTarget.style.color = 'white'
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(255, 59, 48, 0.25)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 59, 48, 0.08)'
              e.currentTarget.style.color = '#ff3b30'
              e.currentTarget.style.boxShadow = 'none'
            }}
          />
        </Stack>

        <Stack direction="column" spacing={2.5}>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Typography
              level="body-sm"
              sx={{
                fontSize: '0.875rem',
                width: '100px',
                color: '#4b5563',
                fontWeight: 500,
              }}
            >
              Description
            </Typography>
            <Input
              value={activityInfo.description}
              size="md"
              placeholder="Activity description.."
              style={{
                width: '100%',
                borderRadius: '10px',
                padding: '8px 12px',
                border: '1px solid #e2e8f0',
                transition: 'all 0.2s ease',
              }}
              onFocus={(e) => {
                e.target.style.border = '1px solid #3b82f6'
              }}
              onBlur={(e) => {
                e.target.style.border = '1px solid #e2e8f0'
              }}
              onChange={(value) => handleInputChange('description', value)}
            />
          </Stack>

          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Typography
              level="body-sm"
              sx={{
                fontSize: '0.875rem',
                width: '100px',
                color: '#4b5563',
                fontWeight: 500,
              }}
            >
              Subject
            </Typography>
            <SelectPicker
              size="md"
              placeholder="Select subject.."
              style={{
                width: '100%',
              }}
              menuStyle={{
                fontSize: '13px',
                zIndex: '12000',
                padding: 0,
              }}
              data={workItemsData}
              value={activityInfo.workItemId}
              onChange={(selectedId) => handleInputChange('workItemId', selectedId)}
              searchable={false}
            />
          </Stack>

          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Typography
              level="body-sm"
              sx={{
                fontSize: '0.875rem',
                width: '100px',
                color: '#4b5563',
                fontWeight: 500,
              }}
            >
              Start Time
            </Typography>
            <InputGroup style={{ width: '100%' }}>
              <InputGroup.Addon
                style={{
                  backgroundColor: '#f8fafc',
                  borderRight: 'none',
                  color: '#64748b',
                  padding: '0 12px',
                }}
              >
                ⏲️
              </InputGroup.Addon>
              <DatePicker
                format="dd/MM/yyyy HH:mm"
                style={{
                  width: '100%',
                  borderRadius: '0 10px 10px 0',
                }}
                menuStyle={{ zIndex: '12000' }}
                onChange={(value) => handleInputChange('startTime', new Date(value))}
                value={new Date(activityInfo.startTime)}
                isoWeek
              />
            </InputGroup>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Typography
              level="body-sm"
              sx={{
                fontSize: '0.875rem',
                width: '100px',
                color: '#4b5563',
                fontWeight: 500,
              }}
            >
              End Time
            </Typography>
            <InputGroup style={{ width: '100%' }}>
              <InputGroup.Addon
                style={{
                  backgroundColor: '#f8fafc',
                  borderRight: 'none',
                  color: '#64748b',
                  padding: '0 12px',
                }}
              >
                ⏰
              </InputGroup.Addon>
              <DatePicker
                format="dd/MM/yyyy HH:mm"
                style={{
                  width: '100%',
                  borderRadius: '0 10px 10px 0',
                }}
                menuStyle={{ zIndex: '12000' }}
                onChange={(value) => handleInputChange('endTime', new Date(value))}
                value={new Date(activityInfo.endTime)}
                isoWeek
              />
            </InputGroup>
          </Stack>
        </Stack>

        <Stack
          direction="row"
          spacing={2}
          sx={{
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          {!isNew && PermissionChecker.hasPermission(userPermissions, 'Activity', PermissionTypes.Delete) && (
            <RsuiteButton
              appearance="primary"
              color="red"
              size="sm"
              onClick={() => onDelete(activityInfo.id)}
              style={{
                width: '72px',
                height: '36px',
                borderRadius: '10px',
                marginBottom: '10px',
                background: '#ff3b30',
                color: '#ff3b30',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 59, 48, 0.25)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <DeleteIcon sx={{ fontSize: '18px', color: 'white' }} />
            </RsuiteButton>
          )}
          <RsuiteButton
            appearance="primary"
            size="sm"
            onClick={() => onSubmit(activityInfo)}
            style={{
              minWidth: '120px',
              height: '36px',
              borderRadius: '10px',
              marginBottom: '10px',
              background: isNew ? 'linear-gradient(135deg, #059669, #10b981)' : 'linear-gradient(135deg, #2563eb, #3b82f6)',
              border: 'none',
              fontWeight: '600',
              fontSize: '0.875rem',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = `0 4px 12px ${isNew ? 'rgba(16, 185, 129, 0.25)' : 'rgba(37, 99, 235, 0.25)'}`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {isNew ? 'Create Activity' : 'Update Activity'}
          </RsuiteButton>
        </Stack>
      </Stack>
    </Card>
  )
}
