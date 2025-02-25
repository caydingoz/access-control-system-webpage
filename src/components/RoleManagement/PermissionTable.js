import React, { useEffect } from 'react'
import { Table, Typography, Sheet, Checkbox, Stack, Card } from '@mui/joy'
import { TagPicker, Button, IconButton } from 'rsuite'
import TrashIcon from '@rsuite/icons/Trash'
import PlusIcon from '@rsuite/icons/Plus'
import CloseIcon from '@rsuite/icons/Close'
import { format } from 'date-fns'
import RoleManagementService from 'src/services/RoleManagementService'
import FlagChecker from '../../helpers/flagChecker'
import { PermissionTypes } from '../../enums/PermissionTypes'
import PermissionChecker from '../../helpers/permissionChecker'
import { useSelector } from 'react-redux'

export default function PermissionTable({ roleId, roleName }) {
  const userPermissions = useSelector((state) => state.auth.permissions)

  function formatDateTime(inputDateTime) {
    const date = new Date(inputDateTime)
    return format(date, 'dd-MM-yyyy HH:mm')
  }

  useEffect(() => {
    async function fetchData() {
      const res = await RoleManagementService.getPermissionsByRoleIdAsync(0, 500, roleId, 'asc', 'id')
      if (res.success) {
        setPermissions(res.data.permissions)
      }
    }

    fetchData()
  }, [roleId])

  const [permissions, setPermissions] = React.useState([])
  const [visibleAddPermission, setVisibleAddPermission] = React.useState(false)
  const [newPermissions, setPermissionsForAddNew] = React.useState([])
  const [blockedPermissions, setBlockedPermissionsForAddNew] = React.useState([])
  const [selectedNewPermissions, setSelectedPermissionsForAddNew] = React.useState([])

  const handleOpenAddPermission = async () => {
    setPermissionsForAddNew([])
    setBlockedPermissionsForAddNew([])
    await getPermissionsForAddNew()
    setVisibleAddPermission((prev) => !prev)
  }

  const handleCloseAddPermission = async () => {
    setPermissionsForAddNew([])
    setBlockedPermissionsForAddNew([])
    setVisibleAddPermission(false)
  }

  const handleAddPermissionToRole = async () => {
    var res = await RoleManagementService.addPermissionToRoleAsync(roleId, selectedNewPermissions)
    if (res.success) {
      setPermissionsForAddNew([])
      setBlockedPermissionsForAddNew([])
      const permissionsData = await RoleManagementService.getPermissionsByRoleIdAsync(0, 500, roleId, 'asc', 'id')
      setPermissions(permissionsData.data.permissions)
      setVisibleAddPermission(false)
    }
  }
  const handleSelectNewPermission = (value) => {
    setSelectedPermissionsForAddNew(value.map((item) => ({ operation: item })))
  }

  const deletePermission = async (id) => {
    var res = await RoleManagementService.deletePermissionsByIdAsync(roleId, id)
    if (res.success) {
      const permissionsData = await RoleManagementService.getPermissionsByRoleIdAsync(0, 500, roleId, 'asc', 'id')
      setPermissions(permissionsData.data.permissions)
    }
  }

  const changePermissionType = async (event, permission, permissionType) => {
    if (FlagChecker.hasFlag(permission.type, permissionType)) {
      permission.type = FlagChecker.removeFlag(permission.type, permissionType)
    } else {
      permission.type = FlagChecker.addFlag(permission.type, permissionType)
    }

    var res = await RoleManagementService.changePermissionTypeAsync(roleId, permission.id, permission.type)
    if (res.success) {
      const permissionsData = await RoleManagementService.getPermissionsByRoleIdAsync(0, 500, roleId, 'asc', 'id')
      setPermissions(permissionsData.data.permissions)
    }
  }

  const getPermissionsForAddNew = async () => {
    var res = await RoleManagementService.getPermissionsAsync()
    if (res.success) {
      const allPermissions = res.data.permissions.map((item) => ({ label: item, value: item }))
      const currentPermissions = permissions.map((item) => item.operation)
      setPermissionsForAddNew(allPermissions)
      setBlockedPermissionsForAddNew(allPermissions.filter((item) => currentPermissions.includes(item.value)).map((item) => item.value))
    }
  }

  return (
    <tr style={{ cursor: 'default' }}>
      <td style={{ height: 0, padding: 0, cursor: 'default' }} colSpan={3}>
        <Sheet
          variant="plain"
          sx={{
            height: 450,
            overflow: 'auto',
            p: 2,
            zIndex: 3,
            backgroundColor: 'transparent',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography level="title-sm" sx={{ mb: 1 }}>
              Permissions for {roleName}
              <br />
              <Typography level="body-xs" sx={{ fontWeight: 'normal' }}>
                The Permissions table contains a list of actions that define user access and control within the system.
              </Typography>
            </Typography>
            <div>
              {PermissionChecker.hasPermission(userPermissions, 'Role', PermissionTypes.Write) && (
                <IconButton
                  appearance="primary"
                  color="green"
                  icon={<PlusIcon />}
                  size="xs"
                  style={{ fontSize: '13px' }}
                  onClick={handleOpenAddPermission}
                >
                  Add Permission
                </IconButton>
              )}
              {visibleAddPermission && (
                <Card
                  sx={{
                    position: 'absolute',
                    marginTop: '5px',
                    right: '20px',
                    width: '300px',
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
                      New Permissions
                      <br></br>
                      <Typography level="body-xs" sx={{ fontWeight: 'normal' }}>
                        Multiple permissions can be selected.
                      </Typography>
                    </Typography>
                    <div>
                      <IconButton color="red" appearance="primary" onClick={handleCloseAddPermission} size="xs" icon={<CloseIcon />} />
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
                    <TagPicker
                      size="sm"
                      placeholder="Select"
                      style={{ width: 250, fontSize: '12px' }}
                      menuStyle={{ width: 200, fontSize: '12px' }}
                      data={newPermissions}
                      disabledItemValues={blockedPermissions}
                      onChange={handleSelectNewPermission}
                    />
                    <Button
                      appearance="primary"
                      color="green"
                      size="sm"
                      onClick={handleAddPermissionToRole}
                      style={{ width: '20%', fontSize: '12px' }}
                    >
                      Add
                    </Button>
                  </Stack>
                </Card>
              )}
            </div>
          </div>
          <Sheet
            variant="plain"
            sx={{
              height: 360,
              backgroundColor: 'transparent',
              pt: 2,
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
            <Table
              stickyHeader
              borderAxis="both"
              size="sm"
              sx={{
                '--TableCell-headBackground': (theme) => theme.vars.palette.neutral.softBg,
                '--TableCell-selectedBackground': (theme) => theme.vars.palette.success.softBg,
                '& tbody tr': { height: '31px', cursor: 'default' },
                '& thead tr': { height: '31px' },
                '& thead > tr > th:nth-of-type(n)': { width: '100%' },
                '& thead > tr > th:nth-of-type(4)': { width: '30%', textAlign: 'center' },
                '& tbody > tr > td:nth-of-type(4)': { width: '30%', textAlign: 'center' },
              }}
            >
              <thead style={{ pointerEvents: 'none' }}>
                <tr>
                  <th>Operation</th>
                  <th>Type</th>
                  <th>Update Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {permissions.length > 0 ? (
                  permissions.map((permission) => (
                    <tr key={permission.id}>
                      <td>
                        <Typography level="body-xs">{permission.operation}</Typography>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <div style={{ flex: '1' }}>
                            <Checkbox
                              color="neutral"
                              onClick={async (event) => await changePermissionType(event, permission, PermissionTypes.Read)}
                              checked={FlagChecker.hasFlag(permission.type, PermissionTypes.Read)}
                              sx={{
                                verticalAlign: 'middle',
                                pointerEvents: PermissionChecker.hasPermission(userPermissions, 'Role', PermissionTypes.Write) ? 'auto' : 'none',
                              }}
                              size="sm"
                            />
                            <span style={{ verticalAlign: 'middle', paddingLeft: '3px' }}>Read</span>
                          </div>
                          <div style={{ flex: '1' }}>
                            <Checkbox
                              color="success"
                              onClick={async (event) => await changePermissionType(event, permission, PermissionTypes.Write)}
                              checked={FlagChecker.hasFlag(permission.type, PermissionTypes.Write)}
                              sx={{
                                verticalAlign: 'middle',
                                pointerEvents: PermissionChecker.hasPermission(userPermissions, 'Role', PermissionTypes.Write) ? 'auto' : 'none',
                              }}
                              size="sm"
                            />
                            <span style={{ verticalAlign: 'middle', paddingLeft: '3px' }}>Write</span>
                          </div>
                          <div style={{ flex: '1' }}>
                            <Checkbox
                              color="danger"
                              onClick={async (event) => await changePermissionType(event, permission, PermissionTypes.Delete)}
                              checked={FlagChecker.hasFlag(permission.type, PermissionTypes.Delete)}
                              sx={{
                                verticalAlign: 'middle',
                                pointerEvents: PermissionChecker.hasPermission(userPermissions, 'Role', PermissionTypes.Write) ? 'auto' : 'none',
                              }}
                              size="sm"
                            />
                            <span style={{ verticalAlign: 'middle', paddingLeft: '3px' }}>Delete</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Typography level="body-xs">{formatDateTime(permission.updatedAt)}</Typography>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {PermissionChecker.hasPermission(userPermissions, 'Role', PermissionTypes.Delete) ? (
                          <IconButton
                            color="red"
                            appearance="primary"
                            onClick={async () => await deletePermission(permission.id)}
                            size="xs"
                            icon={<TrashIcon />}
                          />
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr
                    style={{
                      '--TableRow-hoverBackground': 'transparent',
                    }}
                  >
                    <td colSpan={4} aria-hidden style={{ fontWeight: 'normal', color: 'gray' }}>
                      There is no data..
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Sheet>
        </Sheet>
      </td>
    </tr>
  )
}
