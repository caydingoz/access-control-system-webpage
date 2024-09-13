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
import { SelectPicker } from 'rsuite'

export default function PermissionTable(props) {
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
  const { roleId } = props

  const [permissions, setPermissions] = React.useState([])

  useEffect(() => {
    async function fetchData() {
      const res = await RoleManagementService.getPermissionsByRoleIdAsync(0, 500, roleId, 'asc', 'id')
      if (res.success) {
        setPermissions(res.data.permissions)
      }
    }

    fetchData()
  }, [roleId])

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

  return (
    <tr>
      <td style={{ height: 0, padding: 0 }} colSpan={5}>
        <Sheet variant="plain" sx={{ height: 350, overflow: 'auto', pr: 3, pl: 3, boxShadow: 'inset 0 2px 2px 0 rgba(0 0 0 / 0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1%' }}>
            <Typography level="title-sm" sx={{ mb: 1 }}>
              Permissions
              <br></br>
              <Typography level="body-xs" sx={{ fontWeight: 'normal' }}>
                The Permissions table contains a list of actions that define user access and control within the system.
              </Typography>
            </Typography>
            <IconButton appearance="primary" color="green" icon={<PlusIcon />} size="xs" style={{ marginBottom: '4px' }}>
              Add new
            </IconButton>
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
