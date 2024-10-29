import React from 'react'
import { Typography, Stack, Card } from '@mui/joy'
import { Input, InputGroup, SelectPicker, DatePicker } from 'rsuite'
import { IconButton as RsuiteIconButton, Button as RsuiteButton } from 'rsuite'
import RsuiteCloseIcon from '@rsuite/icons/Close'
import 'src/css/style.css'

export default function ActivityInfo({ activity = {}, workItems = [], isNew, onSubmit, onClose }) {
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
      <Stack
        direction="row"
        spacing={1}
        sx={{
          justifyContent: 'space-between',
          marginBottom: '10px',
        }}
      >
        <Typography level="title-sm" sx={{ mb: 1 }}>
          {isNew ? 'New Activity' : 'Update Activity'}
          <br></br>
          <Typography level="body-xs" sx={{ fontWeight: 'normal' }}>
            {isNew
              ? 'Please fill in the fields below to create a new activity.'
              : 'Update the necessary details below to modify the activity information.'}
          </Typography>
        </Typography>
        <div>
          <RsuiteIconButton color="red" appearance="primary" onClick={onClose} size="xs" icon={<RsuiteCloseIcon />} />
        </div>
      </Stack>
      <Stack direction="column" spacing={1}>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Stack direction="column" spacing={1}>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography level="body-md" sx={{ fontSize: '13px' }}>
                Description
              </Typography>
              <InputGroup style={{ width: 300, fontSize: '12px' }}>
                <Input
                  value={activityInfo.description}
                  size="sm"
                  placeholder="Description.."
                  onChange={(value) => handleInputChange('description', value)}
                />
              </InputGroup>
            </Stack>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography level="body-md" sx={{ fontSize: '13px' }}>
                Subject
              </Typography>
              <SelectPicker
                size="sm"
                placeholder="Select.."
                style={{ width: '300px' }}
                menuStyle={{ fontSize: '13px', zIndex: '12000', padding: 0 }}
                data={workItemsData}
                value={activityInfo.workItemId}
                onChange={(selectedId) => {
                  handleInputChange('workItemId', selectedId)
                }}
                searchable={false}
              />
            </Stack>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography level="body-md" sx={{ fontSize: '13px' }}>
                Start Time
              </Typography>
              <InputGroup style={{ width: 300, fontSize: '12px' }}>
                <InputGroup.Addon style={{ fontSize: '12px' }}>⏲️</InputGroup.Addon>
                <DatePicker
                  size="sm"
                  format="dd/MM/yyyy HH:mm"
                  style={{
                    width: '100%',
                    borderRadius: 'sm',
                    boxShadow: 'sm',
                    backgroundColor: 'transparent',
                  }}
                  menuStyle={{ zIndex: '12000' }}
                  onChange={(value) => handleInputChange('startTime', new Date(value))}
                  value={new Date(activityInfo.startTime)}
                  isoWeek
                />
              </InputGroup>
            </Stack>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography level="body-md" sx={{ fontSize: '13px' }}>
                End Time
              </Typography>
              <InputGroup style={{ width: 300, fontSize: '12px' }}>
                <InputGroup.Addon style={{ fontSize: '12px' }}>⏰</InputGroup.Addon>
                <DatePicker
                  size="sm"
                  format="dd/MM/yyyy HH:mm"
                  style={{
                    width: '100%',
                    borderRadius: 'sm',
                    boxShadow: 'sm',
                    backgroundColor: 'transparent',
                  }}
                  menuStyle={{ zIndex: '12000' }}
                  onChange={(value) => handleInputChange('endTime', new Date(value))}
                  value={new Date(activityInfo.endTime)}
                  isoWeek
                />
              </InputGroup>
            </Stack>
          </Stack>
        </Stack>
        <RsuiteButton
          appearance="primary"
          color={isNew ? 'green' : 'yellow'}
          size="sm"
          onClick={() => onSubmit(activityInfo)}
          style={{ width: '20%', fontSize: '12px', height: '27px', borderRadius: '5px', marginLeft: 'auto', marginTop: '20px' }}
        >
          {isNew ? 'Create' : 'Update'}
        </RsuiteButton>
      </Stack>
    </Card>
  )
}
