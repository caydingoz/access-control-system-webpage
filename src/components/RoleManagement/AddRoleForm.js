import React from 'react'
import { Card, Stack, Typography, Input } from '@mui/joy'
import { IconButton as RsuiteIconButton, Button as RsuiteButton } from 'rsuite'
import RsuiteCloseIcon from '@rsuite/icons/Close'

export default function AddRoleForm({ visibleAddRole, setVisibleAddRole, newRole, handleNewRoleName, handleAddNewRole }) {
  return (
    visibleAddRole && (
      <Card
        sx={{
          position: 'absolute',
          left: '1.6%',
          marginTop: '5px',
          width: '350px',
          zIndex: 20,
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
            New Role
            <br></br>
            <Typography level="body-xs" sx={{ fontWeight: 'normal' }}>
              Type the name of the role here.
            </Typography>
          </Typography>
          <div>
            <RsuiteIconButton color="red" appearance="primary" onClick={() => setVisibleAddRole(false)} size="xs" icon={<RsuiteCloseIcon />} />
          </div>
        </Stack>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            marginTop: '5px',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Input value={newRole} size="sm" placeholder="Role name.." style={{ width: 300, fontSize: '12px' }} onChange={handleNewRoleName} />
          <RsuiteButton
            appearance="primary"
            color="green"
            size="sm"
            onClick={handleAddNewRole}
            style={{
              width: '20%',
              fontSize: '12px',
              height: '26.5px',
              borderRadius: '5px',
            }}
          >
            Add
          </RsuiteButton>
        </Stack>
      </Card>
    )
  )
}
