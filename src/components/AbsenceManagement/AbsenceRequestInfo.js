import React from 'react'
import { Typography, Stack, Card } from '@mui/joy'
import { Input, InputGroup, SelectPicker, DatePicker } from 'rsuite'
import { IconButton as RsuiteIconButton, Button as RsuiteButton } from 'rsuite'
import RsuiteCloseIcon from '@rsuite/icons/Close'

export default function AbsenceRequestInfo({ types = [], onSubmit, onClose }) {
  const [absenceInfo, setAbsenceInfo] = React.useState({
    description: '',
    startTime: new Date(new Date().setHours(8, 0, 0, 0)),
    endTime: new Date(new Date().setHours(17, 0, 0, 0)),
    type: null,
  })

  const handleInputChange = (key, value) => {
    setAbsenceInfo({
      ...absenceInfo,
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
        }}
      >
        <Typography level="title-sm" sx={{ mb: 1 }}>
          New absence
          <br></br>
          <Typography level="body-xs" sx={{ fontWeight: 'normal' }}>
            Please fill in the fields below to create a new absence.
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
          <Typography level="body-md" sx={{ fontSize: '13px' }}>
            Description
          </Typography>
          <InputGroup style={{ width: 300, fontSize: '12px' }}>
            <Input
              value={absenceInfo.firstName}
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
            Start Time
          </Typography>
          <InputGroup style={{ width: 300, fontSize: '12px' }}>
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
              onChange={(value) => {
                const selectedDate = new Date(new Date(value).setHours(8, 0, 0, 0))
                handleInputChange('startTime', selectedDate)
              }}
              onSelect={(value) => {
                const selectedDate = new Date(new Date(value).setHours(8, 0, 0, 0))
                handleInputChange('startTime', selectedDate)
              }}
              value={absenceInfo.startTime}
              hideHours={(hour) => hour !== 8 && hour !== 12 && hour !== 17}
              hideMinutes={(minutes) => minutes !== 0}
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
              onChange={(value) => {
                const selectedDate = new Date(new Date(value).setHours(17, 0, 0, 0))
                handleInputChange('endTime', selectedDate)
              }}
              onSelect={(value) => {
                const selectedDate = new Date(new Date(value).setHours(17, 0, 0, 0))
                handleInputChange('endTime', selectedDate)
              }}
              value={absenceInfo.endTime}
              hideHours={(hour) => hour !== 8 && hour !== 12 && hour !== 17}
              hideMinutes={(minutes) => minutes !== 0}
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
            Leave Type
          </Typography>
          <SelectPicker
            size="sm"
            placeholder="Select.."
            style={{ fontSize: '12px', width: 300 }}
            menuStyle={{ fontSize: '12px', zIndex: '1100' }}
            data={types}
            onChange={(selectedId) => {
              handleInputChange('type', selectedId)
            }}
          />
        </Stack>
        <RsuiteButton
          appearance="primary"
          color="green"
          size="sm"
          onClick={() => onSubmit(absenceInfo)}
          style={{ width: '20%', fontSize: '12px', height: '27px', borderRadius: '5px', marginLeft: 'auto', marginTop: '20px' }}
        >
          Create
        </RsuiteButton>
      </Stack>
    </Card>
  )
}
