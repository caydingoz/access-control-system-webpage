import React from 'react'
import { Typography, IconButton, Stack, Card } from '@mui/joy'
import { Input, InputGroup, TagPicker } from 'rsuite'
import { IconButton as RsuiteIconButton, Button as RsuiteButton } from 'rsuite'
import UserBadgeIcon from '@rsuite/icons/UserBadge'
import PhoneIcon from '@rsuite/icons/Phone'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import RsuiteCloseIcon from '@rsuite/icons/Close'

export default function UserInfo({ user = {}, roles = [], isNew, onSubmit, onClose }) {
  const [userInfo, setUserInfo] = React.useState({
    id: user.id || '',
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    phoneNumber: user.phoneNumber || '',
    email: user.email || '',
    title: user.title || '',
    image: user.image || '',
    roleIds: Array.isArray(user.roles) ? user.roles.map((role) => role.id) : [],
  })

  const handleInputChange = (key, value) => {
    setUserInfo({
      ...userInfo,
      [key]: value,
    })
  }

  return (
    <Card
      sx={{
        width: '100%',
        maxWidth: '600px',
        p: 3,
        borderRadius: '16px',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
      }}
    >
      <Stack direction="row" spacing={2.5} sx={{ mb: 3, alignItems: 'center' }}>
        <IconButton
          variant="soft"
          sx={{
            width: 85,
            height: 85,
            borderRadius: '16px',
            background: 'linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%)',
            transition: 'transform 0.2s ease',
          }}
        >
          <AddAPhotoIcon
            sx={{
              fontSize: 26,
              color: '#94a3b8',
              transition: 'color 0.2s ease',
              '&:hover': {
                color: '#3b82f6',
              },
            }}
          />
        </IconButton>

        <Stack sx={{ flex: 1 }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography
              level="h4"
              sx={{
                fontSize: '1.2rem',
                fontWeight: 700,
                background: isNew ? 'linear-gradient(120deg, #059669, #10b981)' : 'linear-gradient(120deg, #2563eb, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {isNew ? 'New User' : 'Edit User'}
            </Typography>
            <RsuiteIconButton
              size="sm"
              appearance="subtle"
              onClick={onClose}
              icon={<RsuiteCloseIcon />}
              style={{
                width: '32px',
                height: '32px',
                background: 'rgba(255, 59, 48, 0.1)',
                color: '#ff3b30',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#ff3b30'
                e.currentTarget.style.color = 'white'
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(255, 59, 48, 0.25)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 59, 48, 0.1)'
                e.currentTarget.style.color = '#ff3b30'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
          </Stack>

          <Stack direction="row" spacing={1}>
            <InputGroup style={{ flex: 1 }}>
              <Input
                value={userInfo.firstName}
                size="md"
                placeholder="First name"
                style={{ borderRadius: '8px' }}
                onChange={(value) => handleInputChange('firstName', value)}
              />
            </InputGroup>
            <InputGroup style={{ flex: 1 }}>
              <Input
                value={userInfo.lastName}
                size="md"
                placeholder="Last name"
                style={{ borderRadius: '8px' }}
                onChange={(value) => handleInputChange('lastName', value)}
              />
            </InputGroup>
          </Stack>
        </Stack>
      </Stack>

      <Stack spacing={1} sx={{ mb: 2.5 }}>
        <Typography
          level="body-sm"
          sx={{
            color: '#4b5563',
            fontSize: '0.85rem',
            fontWeight: 600,
            letterSpacing: '0.5px',
          }}
        >
          Contact Information
        </Typography>
        <Stack direction="row" spacing={1}>
          <InputGroup style={{ flex: 1 }}>
            <InputGroup.Addon>
              <PhoneIcon style={{ fontSize: '16px', color: '#6b7280' }} />
            </InputGroup.Addon>
            <Input
              value={userInfo.phoneNumber}
              size="md"
              placeholder="Phone"
              style={{ borderRadius: '8px' }}
              onChange={(value) => handleInputChange('phoneNumber', value)}
            />
          </InputGroup>
          <InputGroup style={{ flex: 1 }}>
            <InputGroup.Addon style={{ color: '#6b7280' }}>@</InputGroup.Addon>
            <Input
              value={userInfo.email}
              size="md"
              placeholder="Email"
              style={{ borderRadius: '8px' }}
              onChange={(value) => handleInputChange('email', value)}
            />
          </InputGroup>
        </Stack>
      </Stack>

      <Stack spacing={1} sx={{ mb: 3 }}>
        <Typography
          level="body-sm"
          sx={{
            color: '#4b5563',
            fontSize: '0.85rem',
            fontWeight: 600,
            letterSpacing: '0.5px',
          }}
        >
          Position & Roles
        </Typography>
        <InputGroup style={{ width: '100%' }}>
          <InputGroup.Addon>
            <UserBadgeIcon style={{ fontSize: '16px', color: '#6b7280' }} />
          </InputGroup.Addon>
          <Input
            value={userInfo.title}
            size="md"
            placeholder="Job title"
            style={{ borderRadius: '8px' }}
            onChange={(value) => handleInputChange('title', value)}
          />
        </InputGroup>
        <TagPicker
          block
          size="md"
          placeholder="Select roles"
          menuStyle={{ zIndex: '2300' }}
          data={roles}
          value={roles.filter((role) => userInfo.roleIds.includes(role.value)).map((role) => role.value)}
          onChange={(selectedIds) => handleInputChange('roleIds', selectedIds)}
          style={{
            borderRadius: '6px',
            transition: 'all 0.2s ease',
          }}
        />
      </Stack>

      <Stack direction="row" justifyContent="flex-end">
        <RsuiteButton
          appearance="primary"
          color={isNew ? 'green' : 'blue'}
          size="md"
          onClick={() => onSubmit(userInfo)}
          style={{
            minWidth: '120px',
            borderRadius: '8px',
            fontWeight: 600,
            background: isNew ? 'linear-gradient(135deg, #059669, #10b981)' : 'linear-gradient(135deg, #2563eb, #3b82f6)',
            border: 'none',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          {isNew ? 'Create' : 'Save'}
        </RsuiteButton>
      </Stack>
    </Card>
  )
}
