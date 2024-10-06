import React from 'react'
import { Typography, IconButton } from '@mui/joy'
import { Stack, Card } from '@mui/joy'
import { Input, InputGroup, TagPicker } from 'rsuite'
import { IconButton as RsuiteIconButton, Button as RsuiteButton } from 'rsuite'
import UserBadgeIcon from '@rsuite/icons/UserBadge'
import LocationIcon from '@rsuite/icons/Location'
import PhoneIcon from '@rsuite/icons/Phone'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import RsuiteCloseIcon from '@rsuite/icons/Close'

export default function UserInfo({ user = {}, roles, isNew, onSubmit, onClose }) {
  const [userInfo, setUserInfo] = React.useState({
    id: user.Id || '',
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    phoneNumber: user.phoneNumber || '',
    email: user.email || '',
    title: user.title || '',
    roleIds: user.roleIds || [],
  })

  const handleInputChange = (key, value) => {
    console.log(key, value)
    setUserInfo({
      ...userInfo,
      [key]: value,
    })
    console.log(userInfo)
  }

  return (
    <Card
      sx={{
        position: 'absolute',
        left: '1.6%',
        marginTop: '5px',
        width: 400,
        zIndex: 20,
        boxShadow: '0px 0.2px 4px rgba(0, 0, 0, 0.1)',
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
          {isNew ? 'New User' : 'Update User'}
          <br></br>
          <Typography level="body-xs" sx={{ fontWeight: 'normal' }}>
            {isNew ? 'Please fill in the fields below to create a new user.' : 'Update the necessary details below to modify the user information.'}
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
          <IconButton
            variant="outlined"
            sx={{
              width: 100,
              height: 120,
              borderRadius: '5px',
              backgroundColor: 'white',
            }}
          >
            <AddAPhotoIcon />
          </IconButton>
          <Stack direction="column" spacing={1}>
            <InputGroup style={{ width: 250, fontSize: '12px' }}>
              <InputGroup.Addon>
                <LocationIcon />
              </InputGroup.Addon>
              <Input
                value={user.firstName}
                size="sm"
                placeholder="First name.."
                style={{ fontSize: '12px' }}
                onChange={(value) => handleInputChange('firstName', value)}
              />
            </InputGroup>
            <InputGroup style={{ width: 250, fontSize: '12px' }}>
              <InputGroup.Addon>
                <LocationIcon />
              </InputGroup.Addon>
              <Input
                value={user.lastName}
                size="sm"
                placeholder="Last name.."
                style={{ fontSize: '12px' }}
                onChange={(value) => handleInputChange('lastName', value)}
              />
            </InputGroup>
            <InputGroup style={{ width: 250, fontSize: '12px' }}>
              <InputGroup.Addon>
                <PhoneIcon />
              </InputGroup.Addon>
              <Input
                value={user.phoneNumber}
                size="sm"
                placeholder="Phone number.."
                style={{ fontSize: '12px' }}
                onChange={(value) => handleInputChange('phoneNumber', value)}
              />
            </InputGroup>
            <InputGroup style={{ width: 250, fontSize: '12px' }}>
              <InputGroup.Addon> @</InputGroup.Addon>
              <Input
                value={user.email}
                size="sm"
                placeholder="Email.."
                style={{ fontSize: '12px' }}
                onChange={(value) => handleInputChange('email', value)}
              />
            </InputGroup>
            <InputGroup style={{ fontSize: '12px' }}>
              <InputGroup.Addon>
                <UserBadgeIcon />
              </InputGroup.Addon>
              <Input
                value={user.title}
                size="sm"
                placeholder="Title.."
                style={{ fontSize: '12px' }}
                onChange={(value) => handleInputChange('title', value)}
              />
            </InputGroup>
          </Stack>
        </Stack>
        <Typography level="body-sm" sx={{ fontSize: '13px' }}>
          Roles
        </Typography>
        <TagPicker
          size="xs"
          placeholder="Select.."
          style={{ fontSize: '12px', padding: '4px 0' }}
          menuStyle={{ fontSize: '12px', zIndex: '50' }}
          data={roles}
          onChange={(selectedIds) => {
            handleInputChange('roleIds', selectedIds)
          }}
        />
        <RsuiteButton
          appearance="primary"
          color="green"
          size="sm"
          onClick={() => onSubmit(userInfo)}
          style={{ width: '20%', fontSize: '12px', height: '27px', borderRadius: '5px', marginLeft: 'auto', marginTop: '20px' }}
        >
          Add
        </RsuiteButton>
      </Stack>
    </Card>
  )
}
