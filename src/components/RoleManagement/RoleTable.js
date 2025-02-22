import React, { useEffect } from 'react'
import { Box, Typography, Sheet, Checkbox, Tooltip } from '@mui/joy'
import { Stack, List, ListItem } from '@mui/joy'
import { IconButton as RsuiteIconButton } from 'rsuite'
import PlusIcon from '@rsuite/icons/Plus'
import TrashIcon from '@rsuite/icons/Trash'
import FunnelIcon from '@rsuite/icons/Funnel'
import RoleManagementService from 'src/services/RoleManagementService'
import PermissionTable from './PermissionTable'
import { useSelector } from 'react-redux'
import PermissionChecker from '../../helpers/permissionChecker'
import { PermissionTypes } from '../../enums/PermissionTypes'
import AddRoleForm from './AddRoleForm'
import RoleTableFooter from './RoleTableFooter'
import RoleTableFilterForm from './RoleTableFilterForm'

export default function RoleTable() {
  const userPermissions = useSelector((state) => state.auth.permissions)
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
        <RoleTableFilterForm
          setFilterName={setFilterName}
          setFilterPermissions={setFilterPermissions}
          permissions={permissions}
          setOpenedId={setOpenedId}
        />
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
              {PermissionChecker.hasPermission(userPermissions, 'Role', PermissionTypes.Write) && (
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
              )}
              <AddRoleForm
                visible={visibleAddRole}
                setVisible={setVisibleAddRole}
                handleAddNewRole={handleAddNewRole}
                handleNewRoleName={handleNewRoleName}
              />
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
                          disabled={!PermissionChecker.hasPermission(userPermissions, 'Role', PermissionTypes.Delete)}
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

            <RoleTableFooter
              page={page}
              setPage={setPage}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              totalCount={totalCount}
              setOpenedId={setOpenedId}
            />
          </Sheet>

          {/* Sağ Panel - İzinler Tablosu */}
          <Sheet
            variant="outlined"
            sx={{
              flex: 1,
              borderRadius: 'sm',
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
              <Box sx={{ p: 2, overflow: 'auto' }}>
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
