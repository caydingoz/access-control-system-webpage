import React, { useEffect } from 'react'
import { Box, Typography, Sheet, Checkbox, FormControl, FormLabel, IconButton, Tooltip, Select, Option } from '@mui/joy'
import { Button, Stack, Card, List, ListItem } from '@mui/joy'
import { Input, SelectPicker } from 'rsuite'
import { IconButton as RsuiteIconButton, Button as RsuiteButton } from 'rsuite'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import PlusIcon from '@rsuite/icons/Plus'
import TrashIcon from '@rsuite/icons/Trash'
import FunnelIcon from '@rsuite/icons/Funnel'
import RsuiteCloseIcon from '@rsuite/icons/Close'
import RoleManagementService from 'src/services/RoleManagementService'
import PermissionTable from './PermissionTable'

export default function RoleTable() {
  const [filterName, setFilterName] = React.useState(null)
  const [filterPermissions, setFilterPermissions] = React.useState(null)
  const [selectedRoles, setSelectedRoles] = React.useState([])
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [totalCount, setTotalCount] = React.useState(0)
  const [roles, setRoles] = React.useState([])
  const [permissions, setPermissions] = React.useState([])
  const [openedId, setOpenedId] = React.useState()
  const [visibleAddRole, setVisibleAddRole] = React.useState(false)
  const [newRole, setNewRole] = React.useState('')

  useEffect(() => {
    async function fetchData() {
      const roleRes = await RoleManagementService.getRolesAsync(page, rowsPerPage, filterPermissions, filterName)
      if (roleRes.success) {
        setRoles(roleRes.data.roles)
        setTotalCount(roleRes.data.totalCount)

        const permissionRes = await RoleManagementService.getPermissionsAsync()
        if (permissionRes.success) {
          setPermissions(permissionRes.data.permissions.map((item) => ({ label: item, value: item })))
        }
      }
    }

    fetchData()
  }, [page, rowsPerPage, filterPermissions, filterName])

  const deleteRoles = async () => {
    var res = await RoleManagementService.deleteRolesAsync(selectedRoles)
    if (res.success) {
      const rolesData = await RoleManagementService.getRolesAsync(page, rowsPerPage, filterPermissions, filterName)
      setRoles(rolesData.data.roles)
      setTotalCount(rolesData.data.totalCount)
      setSelectedRoles([])
    }
  }

  const handleAddNewRole = async () => {
    setVisibleAddRole(false)
    var res = await RoleManagementService.addRoleAsync(newRole)
    if (res.success) {
      const rolesData = await RoleManagementService.getRolesAsync(page, rowsPerPage, filterPermissions, filterName)
      setRoles(rolesData.data.roles)
      setTotalCount(rolesData.data.totalCount)
      setSelectedRoles([])
    }
  }

  const handleNewRoleName = (value) => {
    setNewRole(value)
  }

  const handleCollapse = async (id) => {
    const isOpened = openedId === id
    setOpenedId(isOpened ? undefined : id)
  }

  const handleSelectRole = (event, id) => {
    const selectedIndex = selectedRoles.indexOf(id)
    let newSelectedRoles = []

    if (selectedIndex === -1) {
      newSelectedRoles = newSelectedRoles.concat(selectedRoles, id)
    } else if (selectedIndex === 0) {
      newSelectedRoles = newSelectedRoles.concat(selectedRoles.slice(1))
    } else if (selectedIndex === selectedRoles.length - 1) {
      newSelectedRoles = newSelectedRoles.concat(selectedRoles.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelectedRoles = newSelectedRoles.concat(selectedRoles.slice(0, selectedIndex), selectedRoles.slice(selectedIndex + 1))
    }

    setSelectedRoles(newSelectedRoles)
  }

  return (
    <div>
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
            Role Management
            <br></br>
            <Typography level="body-xs" sx={{ fontWeight: 'normal' }}>
              The Roles table contains a list of roles that define the permissions and access levels for users within the system. Expand the row to
              view the permissions associated with each role.
            </Typography>
          </Typography>
        </Box>
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
        <Box>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              justifyContent: 'space-between',
              margin: '0 0 1% 0',
            }}
          >
            <div style={{ marginLeft: '2%', width: '100px' }}>
              <RsuiteIconButton
                appearance="primary"
                icon={<PlusIcon />}
                color="green"
                size="xs"
                style={{ width: '100%', fontSize: '13px' }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.01)'
                  e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 128, 0, 0.3)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                onClick={() => setVisibleAddRole((prev) => !prev)}
              >
                Add Role
              </RsuiteIconButton>
              {visibleAddRole && (
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
                      <RsuiteIconButton
                        color="red"
                        appearance="primary"
                        onClick={() => setVisibleAddRole(false)}
                        size="xs"
                        icon={<RsuiteCloseIcon />}
                      />
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
                    <Input
                      value={newRole}
                      size="sm"
                      placeholder="Role name.."
                      style={{ width: 300, fontSize: '12px' }}
                      onChange={handleNewRoleName}
                    />
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
              )}
            </div>
            {selectedRoles.length > 0 && (
              <Typography
                level="body-sm"
                display="inline"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  flex: '1 1 30%',
                  textAlign: 'right',
                  paddingRight: '5px',
                }}
                component="div"
              >
                {selectedRoles.length} selected
              </Typography>
            )}
            {selectedRoles.length > 0 ? (
              <Tooltip title="Delete">
                <RsuiteIconButton
                  appearance="primary"
                  icon={<TrashIcon />}
                  color="red"
                  size="sm"
                  onClick={async () => await deleteRoles()}
                  style={{ marginRight: '2%' }}
                />
              </Tooltip>
            ) : (
              <Tooltip title="Filter list">
                <RsuiteIconButton appearance="subtle" size="sm" icon={<FunnelIcon />} style={{ marginRight: '2%' }} disabled />
              </Tooltip>
            )}
          </Stack>
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            width: '96%',
            height: '70vh',
            margin: '0 2% 2% 2%',
          }}
        >
          {/* Sol Panel - Roller Listesi */}
          <Sheet
            variant="outlined"
            sx={{
              width: '30%',
              borderRadius: 'sm',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'transparent',
              height: '100%',
            }}
          >
            <Box
              sx={{
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                borderTopLeftRadius: 'sm',
                borderTopRightRadius: 'sm',
              }}
            >
              <Typography level="title-md">Roles</Typography>
            </Box>

            <Box
              sx={{
                flex: 1,
                overflow: 'auto',
                '&::-webkit-scrollbar': {
                  width: '8px',
                  backgroundColor: 'background.level1',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'neutral.outlinedBorder',
                  borderRadius: '4px',
                  '&:hover': {
                    backgroundColor: 'neutral.outlinedHoverBorder',
                  },
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: 'transparent',
                },
                // Firefox için scroll bar stillemesi
                scrollbarWidth: 'thin',
                scrollbarColor: 'var(--joy-palette-neutral-outlinedBorder) transparent',
              }}
            >
              <List sx={{ pt: 0, pb: 0 }}>
                {roles.map((role) => {
                  const isItemSelected = selectedRoles.indexOf(role.id) !== -1
                  const isActive = openedId === role.id

                  return (
                    <ListItem
                      key={role.id}
                      sx={{
                        cursor: 'pointer',
                        backgroundColor: isActive ? 'primary.softBg' : 'transparent',
                        '&:hover': {
                          backgroundColor: isActive ? 'primary.softBg' : 'background.level1',
                        },
                      }}
                      onClick={() => handleCollapse(role.id)}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          width: '100%',
                          gap: 1,
                          p: 1,
                        }}
                      >
                        <Checkbox
                          checked={isItemSelected}
                          onChange={(event) => {
                            event.stopPropagation()
                            handleSelectRole(event, role.id)
                          }}
                          size="sm"
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography level="body-sm">{role.name}</Typography>
                        </Box>
                      </Box>
                    </ListItem>
                  )
                })}
              </List>
            </Box>

            <Box
              sx={{
                pt: 1.5,
                pb: 1.5,
                pl: 2,
                borderTop: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <FormControl orientation="horizontal" size="sm">
                <FormLabel>Rows per page:</FormLabel>
                <Select
                  onChange={(event, newValue) => {
                    setRowsPerPage(parseInt(newValue.toString(), 10))
                    setPage(0)
                    setOpenedId(null)
                  }}
                  value={rowsPerPage}
                  size="sm"
                >
                  <Option value={10}>10</Option>
                  <Option value={25}>25</Option>
                  <Option value={50}>50</Option>
                  <Option value={100}>100</Option>
                </Select>
              </FormControl>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pr: 1 }}>
                <IconButton
                  size="sm"
                  disabled={page === 0}
                  onClick={() => {
                    setPage(page - 1)
                    setOpenedId(null)
                  }}
                >
                  <KeyboardArrowLeftIcon />
                </IconButton>
                <Typography level="body-sm" sx={{ alignSelf: 'center' }}>
                  {page + (totalCount > 0 ? 1 : 0)} / {Math.ceil(totalCount / rowsPerPage)}
                </Typography>
                <IconButton
                  size="sm"
                  disabled={page >= Math.ceil(totalCount / rowsPerPage) - 1}
                  onClick={() => {
                    setPage(page + 1)
                    setOpenedId(null)
                  }}
                >
                  <KeyboardArrowRightIcon />
                </IconButton>
              </Box>
            </Box>
          </Sheet>

          {/* Sağ Panel - İzinler Tablosu */}
          <Sheet
            variant="outlined"
            sx={{
              flex: 1,
              borderRadius: 'sm',
              overflow: 'auto',
              backgroundColor: 'transparent',
            }}
          >
            <Box
              sx={{
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                borderTopLeftRadius: 'sm',
                borderTopRightRadius: 'sm',
              }}
            >
              <Typography level="title-md">Permissions</Typography>
            </Box>
            {openedId ? (
              <Box sx={{ p: 2 }}>
                <PermissionTable roleId={openedId.toString()} roleName={roles.find((r) => r.id === openedId)?.name} />
              </Box>
            ) : (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'text.secondary',
                }}
              >
                <Typography level="body-lg">Select a role to view its permissions</Typography>
              </Box>
            )}
          </Sheet>
        </Box>
      </Sheet>
    </div>
  )
}
