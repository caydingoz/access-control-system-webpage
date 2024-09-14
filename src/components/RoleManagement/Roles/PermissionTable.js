import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import Table from '@mui/joy/Table'
import Typography from '@mui/joy/Typography'
import Sheet from '@mui/joy/Sheet'
import Checkbox from '@mui/joy/Checkbox'
import RoleManagementService from 'src/services/RoleManagementService'
import FlagChecker from '../../../helpers/flagChecker'
import { format } from 'date-fns'
import { IconButton } from 'rsuite'
import TrashIcon from '@rsuite/icons/Trash'
import PlusIcon from '@rsuite/icons/Plus'
import { Card, Stack } from '@mui/joy'
import { TagPicker, Button } from 'rsuite'
import CloseIcon from '@rsuite/icons/Close'

export default function PermissionTable(props) {
  const { roleId } = props
  const PermissionTypes = {
    None: 0,
    Read: 1,
    Write: 2,
    Delete: 4,
  }

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
    <tr>
      <td style={{ height: 0, padding: 0 }} colSpan={5}>
        <Sheet variant="plain" sx={{ height: 350, overflow: 'auto', pr: 3, pl: 3, boxShadow: 'inset 0 2px 2px 0 rgba(0 0 0 / 0.08)', zIndex: 3 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1%' }}>
            <Typography level="title-sm" sx={{ mb: 1 }}>
              Permissions
              <br></br>
              <Typography level="body-xs" sx={{ fontWeight: 'normal' }}>
                The Permissions table contains a list of actions that define user access and control within the system.
              </Typography>
            </Typography>
            <div>
              <IconButton appearance="primary" color="green" icon={<PlusIcon />} size="xs" onClick={handleOpenAddPermission}>
                Add new
              </IconButton>
              {visibleAddPermission && (
                <Card
                  sx={{
                    position: 'absolute',
                    marginTop: '5px',
                    right: '20px',
                    width: '35%',
                    zIndex: 20,
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography level="title-sm" sx={{ mb: 1 }}>
                      New Permissions
                      <br></br>
                      <Typography level="body-xs" sx={{ fontWeight: 'normal' }}>
                        Multiple permissions can be selected.
                      </Typography>
                    </Typography>
                    <IconButton color="red" appearance="primary" onClick={handleCloseAddPermission} size="xs" icon={<CloseIcon />} />
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
                      style={{ width: 300, fontSize: '12px' }}
                      menuStyle={{ width: 300, fontSize: '12px' }}
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
          <Table
            stickyHeader
            stickyFooter
            borderAxis="bothBetween"
            size="sm"
            sx={{
              '--TableCell-headBackground': 'transparent',
              '--TableCell-selectedBackground': (theme) => theme.vars.palette.success.softBg,
              '& tbody tr': { height: '32px' },
              '& thead tr': { height: '32px' },
              '& thead > tr > th:nth-of-type(n)': { width: '100%' },
              '& thead > tr > th:nth-of-type(5)': { width: '30%', textAlign: 'center' },
              '& tbody > tr > td:nth-of-type(5)': { width: '30%', textAlign: 'center' },
              pt: 1,
            }}
          >
            <thead style={{ pointerEvents: 'none' }}>
              <tr>
                <th>Operation</th>
                <th>Type</th>
                <th>Create Date</th>
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
                            sx={{ verticalAlign: 'middle' }}
                            size="sm"
                          />
                          <span style={{ verticalAlign: 'middle', paddingLeft: '3px' }}>Read</span>
                        </div>
                        <div style={{ flex: '1' }}>
                          <Checkbox
                            color="success"
                            onClick={async (event) => await changePermissionType(event, permission, PermissionTypes.Write)}
                            checked={FlagChecker.hasFlag(permission.type, PermissionTypes.Write)}
                            sx={{ verticalAlign: 'middle' }}
                            size="sm"
                          />
                          <span style={{ verticalAlign: 'middle', paddingLeft: '3px' }}>Write</span>
                        </div>
                        <div style={{ flex: '1' }}>
                          <Checkbox
                            color="danger"
                            onClick={async (event) => await changePermissionType(event, permission, PermissionTypes.Delete)}
                            checked={FlagChecker.hasFlag(permission.type, PermissionTypes.Delete)}
                            sx={{ verticalAlign: 'middle' }}
                            size="sm"
                          />
                          <span style={{ verticalAlign: 'middle', paddingLeft: '3px' }}>Delete</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Typography level="body-xs">{formatDateTime(permission.createdAt)}</Typography>
                    </td>
                    <td>
                      <Typography level="body-xs">{formatDateTime(permission.updatedAt)}</Typography>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <IconButton
                        color="red"
                        appearance="primary"
                        onClick={async () => await deletePermission(permission.id)}
                        size="xs"
                        icon={<TrashIcon />}
                      />
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
      </td>
    </tr>
  )
}

PermissionTable.propTypes = {
  roleId: PropTypes.string.isRequired,
}
