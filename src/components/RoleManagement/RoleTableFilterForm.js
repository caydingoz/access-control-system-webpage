import React from 'react'
import { Box, Typography, Sheet, Button } from '@mui/joy'
import { Input, SelectPicker } from 'rsuite'

const RoleTableFilterForm = ({ setFilterName, setFilterPermissions, permissions, setOpenedId }) => {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        setOpenedId(null)
        const formElements = event.currentTarget.elements
        setFilterName(formElements.name.value)
        setFilterPermissions(formElements.permissions.value)
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
          <Box sx={{ flex: 1, minWidth: 180 }}>
            <Typography level="title-sm" sx={{ mb: 1 }}>
              What are you looking for?
            </Typography>
            <Input
              name="name"
              placeholder="Search for role, permission, etc."
              variant="outlined"
              size="sm"
              sx={{
                width: '40%',
                borderRadius: 'sm',
                boxShadow: 'sm',
                backgroundColor: 'transparent',
              }}
            />
          </Box>
          <Box sx={{ minWidth: 280 }}>
            <Typography level="title-sm" sx={{ mb: 1 }}>
              Permissions
            </Typography>
            <SelectPicker
              name="permissions"
              size="sm"
              placeholder="All"
              variant="outlined"
              style={{
                width: '100%',
                borderRadius: 'sm',
                boxShadow: 'sm',
                backgroundColor: 'transparent',
              }}
              menuStyle={{ width: 180, fontSize: '13px' }}
              data={permissions}
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
              minWidth: 120,
              '&:hover': {
                background: 'linear-gradient(45deg, #2A8DEB, #105CA8)',
                boxShadow: 'sm',
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

export default RoleTableFilterForm
