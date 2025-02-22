import React from 'react'
import { Box, Typography, Sheet, Button } from '@mui/joy'
import { TagPicker, Input, SelectPicker } from 'rsuite'

export default function UserTableFilterForm({ roles, userStatusData, setFilterName, setFilterStatus, setFilterRoles }) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        const formElements = event.currentTarget.elements
        setFilterName(formElements.name.value)
        setFilterStatus(formElements.status.value)
        setFilterRoles(formElements.filterRoles.value)
      }}
    >
      <Sheet
        variant="outlined"
        sx={{
          width: '96%',
          margin: '0% 2% 1% 2%',
          padding: '15px',
          borderRadius: 'sm',
          backgroundColor: 'transparent',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 3,
            flexWrap: 'wrap',
          }}
        >
          <Box sx={{ flex: 1, minWidth: '300px' }}>
            <Typography level="title-sm" sx={{ mb: 1 }}>
              What are you looking for?
            </Typography>
            <Input
              name="name"
              placeholder="Search for name, email, phone number, etc."
              variant="outlined"
              size="sm"
              sx={{
                width: '100%',
                borderRadius: 'sm',
                boxShadow: 'sm',
                backgroundColor: 'transparent',
              }}
            />
          </Box>
          <Box sx={{ width: '300px' }}>
            <Typography level="title-sm" sx={{ mb: 1 }}>
              Roles
            </Typography>
            <TagPicker
              name="filterRoles"
              size="sm"
              placeholder="Select roles.."
              style={{ width: '100%', fontSize: '12px' }}
              menuStyle={{ fontSize: '12px', zIndex: '100', height: '250px', width: '300px' }}
              data={roles}
            />
          </Box>
          <Box sx={{ width: '300px' }}>
            <Typography level="title-sm" sx={{ mb: 1 }}>
              Status
            </Typography>
            <SelectPicker
              name="status"
              size="sm"
              placeholder="All"
              variant="outlined"
              style={{
                width: '100%',
                borderRadius: 'sm',
                boxShadow: 'sm',
              }}
              searchable={false}
              menuStyle={{ width: '300px', fontSize: '13px' }}
              data={userStatusData}
            />
          </Box>
          <Button
            type="submit"
            variant="solid"
            size="sm"
            sx={{
              padding: '0 31px',
              borderRadius: 'md',
              background: 'linear-gradient(45deg, #3399ff, #126EC9)',
              boxShadow: 'md',
              minWidth: 120,
              '&:hover': {
                background: 'linear-gradient(45deg, #2A8DEB, #105CA8)',
              },
            }}
          >
            Search
          </Button>
        </Box>
      </Sheet>
    </form>
  )
}
