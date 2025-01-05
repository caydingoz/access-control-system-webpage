import React from 'react'
import { Typography, Stack, Card } from '@mui/joy'
import { Input, InputGroup, SelectPicker, DatePicker } from 'rsuite'
import { IconButton as RsuiteIconButton, Button as RsuiteButton } from 'rsuite'
import RsuiteCloseIcon from '@rsuite/icons/Close'
import { useDispatch } from 'react-redux'
import { showAlert } from '../../redux/slices/alertSlice'
import { v4 as uuidv4 } from 'uuid'

export default function AbsenceRequestInfo({ employmentDate, types = [], onSubmit, onClose }) {
  const dispatch = useDispatch()
  const [absenceInfo, setAbsenceInfo] = React.useState({
    description: '',
    type: null,
    startDate: new Date(),
    startHour: 8,
    endDate: new Date(),
    endHour: 17,
  })

  const handleInputChange = (key, value) => {
    setAbsenceInfo((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSubmit = () => {
    const requiredFields = [
      { key: 'type', message: 'Leave Type not selected!' },
      { key: 'startDate', message: 'Start Date not selected!' },
      { key: 'startHour', message: 'Start Hour not selected!' },
      { key: 'endDate', message: 'End Date not selected!' },
      { key: 'endHour', message: 'End Hour not selected!' },
    ]

    for (const field of requiredFields) {
      if (!absenceInfo[field.key]) {
        dispatch(showAlert({ id: uuidv4(), message: field.message, alertType: 'Error' }))
        return
      }
    }
    const startDateTime = new Date(absenceInfo.startDate)
    startDateTime.setHours(absenceInfo.startHour, 0, 0, 0)

    const endDateTime = new Date(absenceInfo.endDate)
    endDateTime.setHours(absenceInfo.endHour, 0, 0, 0)

    const payload = {
      description: absenceInfo.description,
      type: absenceInfo.type,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
    }

    onSubmit(payload)
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
          <br />
          <Typography level="body-xs" sx={{ fontWeight: 'normal' }}>
            Please fill in the fields below to create a new absence.
          </Typography>
        </Typography>
        <div>
          <RsuiteIconButton color="red" appearance="primary" onClick={onClose} size="xs" icon={<RsuiteCloseIcon />} />
        </div>
      </Stack>
      <Stack direction="column" spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography level="body-md" sx={{ fontSize: '13px', minWidth: 100 }}>
            Description
          </Typography>
          <InputGroup style={{ width: 300, fontSize: '12px' }}>
            <Input
              value={absenceInfo.description}
              size="sm"
              placeholder="Description.."
              onChange={(value) => handleInputChange('description', value)}
            />
          </InputGroup>
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center">
          <Typography level="body-md" sx={{ fontSize: '13px', minWidth: 100 }}>
            Start Date
          </Typography>
          <DatePicker
            size="sm"
            format="dd/MM/yyyy"
            style={{ width: 200 }}
            menuStyle={{ zIndex: '12000' }}
            value={absenceInfo.startDate}
            onChange={(value) => handleInputChange('startDate', value)}
            shouldDisableDate={(date) => {
              const minDate = new Date(employmentDate)
              return date < minDate
            }}
            isoWeek
          />
          <SelectPicker
            searchable={false}
            size="sm"
            style={{ width: 100 }}
            menuStyle={{ zIndex: '12000' }}
            data={[
              { label: '08:00', value: 8 },
              { label: '12:00', value: 12 },
            ]}
            value={absenceInfo.startHour}
            onChange={(value) => handleInputChange('startHour', value)}
          />
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center">
          <Typography level="body-md" sx={{ fontSize: '13px', minWidth: 100 }}>
            End Date
          </Typography>
          <DatePicker
            size="sm"
            format="dd/MM/yyyy"
            style={{ width: 200 }}
            menuStyle={{ zIndex: '12000' }}
            value={absenceInfo.endDate}
            onChange={(value) => handleInputChange('endDate', value)}
            shouldDisableDate={(date) => {
              const minDate = new Date(employmentDate)
              return date < minDate
            }}
            isoWeek
          />
          <SelectPicker
            searchable={false}
            size="sm"
            style={{ width: 100 }}
            menuStyle={{ zIndex: '12000' }}
            data={[
              { label: '12:00', value: 12 },
              { label: '17:00', value: 17 },
            ]}
            value={absenceInfo.endHour}
            onChange={(value) => handleInputChange('endHour', value)}
          />
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center">
          <Typography level="body-md" sx={{ fontSize: '13px', minWidth: 100 }}>
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
          onClick={handleSubmit}
          style={{ width: '20%', fontSize: '12px', height: '27px', borderRadius: '5px', marginLeft: 'auto', marginTop: '20px' }}
        >
          Create
        </RsuiteButton>
      </Stack>
    </Card>
  )
}
