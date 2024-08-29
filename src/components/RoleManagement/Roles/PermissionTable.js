import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import Box from '@mui/joy/Box'
import Table from '@mui/joy/Table'
import Typography from '@mui/joy/Typography'
import Sheet from '@mui/joy/Sheet'
import Checkbox from '@mui/joy/Checkbox'
import FormControl from '@mui/joy/FormControl'
import FormLabel from '@mui/joy/FormLabel'
import IconButton from '@mui/joy/IconButton'
import Select from '@mui/joy/Select'
import Option from '@mui/joy/Option'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import RemoveIcon from '@mui/icons-material/Remove'
import RoleManagementService from 'src/services/RoleManagementService'
import FlagChecker from '../../../helpers/flagChecker'
import { format } from 'date-fns'

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

  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [page, setPage] = React.useState(0)
  const [permissions, setPermissions] = React.useState([])
  const [totalCount, setTotalCount] = React.useState(5)

  useEffect(() => {
    async function fetchData() {
      const res = await RoleManagementService.getPermissionsByRoleIdAsync(page, rowsPerPage, roleId, 'asc', 'id')
      if (res.success) {
        setPermissions(res.data.permissions)
        setTotalCount(res.data.totalCount)
      }
    }

    fetchData()
  }, [page, rowsPerPage, roleId])

  const handleChangeRowsPerPage = (event, newValue) => {
    setRowsPerPage(parseInt(newValue.toString(), 10))
    setPage(0)
  }

  const deletePermission = async (id) => {
    var res = await RoleManagementService.deletePermissionsByIdAsync(roleId, id)
    if (res.success) {
      const permissionsData = await RoleManagementService.getPermissionsByRoleIdAsync(page, rowsPerPage, roleId, 'asc', 'id')
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
      const permissionsData = await RoleManagementService.getPermissionsByRoleIdAsync(page, rowsPerPage, roleId, 'asc', 'id')
      setPermissions(permissionsData.data.permissions)
    }
  }
  const emptyRows = Math.max(0, rowsPerPage - permissions.length)

  return (
    <tr>
      <td style={{ height: 0, padding: 0 }} colSpan={5}>
        <Sheet variant="soft" sx={{ pr: 1, pl: 4, boxShadow: 'inset 0 2px 2px 0 rgba(0 0 0 / 0.08)' }}>
          <Table
            borderAxis="bothBetween"
            size="sm"
            sx={{
              '--TableCell-headBackground': 'transparent',
              '--TableCell-selectedBackground': (theme) => theme.vars.palette.success.softBg,
              '& tbody tr': { height: '41px' },
              '& thead > tr > th:nth-of-type(n)': { width: '100%' },
              '& thead > tr > th:nth-of-type(1)': { width: '40px' },
              pt: 1,
            }}
          >
            <thead style={{ pointerEvents: 'none' }}>
              <tr>
                <th />
                <th>Operation</th>
                <th>Type</th>
                <th>Create Date</th>
                <th>Update Date</th>
              </tr>
            </thead>
            <tbody>
              {permissions.length > 0 ? (
                permissions.map((permission) => (
                  <tr key={permission.id}>
                    <td>
                      <IconButton
                        onClick={async () => await deletePermission(permission.id)}
                        color="danger"
                        sx={{ display: 'flex', justifyContent: 'center' }}
                        size="sm"
                      >
                        <RemoveIcon />
                      </IconButton>
                    </td>
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
                  </tr>
                ))
              ) : (
                <tr
                  style={{
                    height: `calc(${1} * 40px)`,
                    '--TableRow-hoverBackground': 'transparent',
                  }}
                >
                  <td />
                  <td colSpan={4} aria-hidden style={{ fontWeight: 'normal', color: 'gray' }}>
                    There is no data..
                  </td>
                </tr>
              )}
              {emptyRows > 0 && (
                <tr
                  style={{
                    height: `calc(${emptyRows} * 46.33px)`,
                    '--TableRow-hoverBackground': 'transparent',
                  }}
                >
                  <td colSpan={5} aria-hidden />
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={5}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      justifyContent: 'flex-end',
                    }}
                  >
                    <FormControl orientation="horizontal" size="sm">
                      <FormLabel>Rows per page:</FormLabel>
                      <Select onChange={handleChangeRowsPerPage} value={rowsPerPage}>
                        <Option value={5}>5</Option>
                        <Option value={10}>10</Option>
                        <Option value={25}>25</Option>
                      </Select>
                    </FormControl>
                    <FormControl orientation="horizontal" size="sm">
                      <FormLabel size="sm">
                        Page: {page + 1}/{rowsPerPage > totalCount ? 1 : Math.ceil(totalCount / rowsPerPage)}
                      </FormLabel>
                    </FormControl>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="sm"
                        color="neutral"
                        variant="outlined"
                        disabled={page === 0}
                        onClick={() => setPage(page - 1)}
                        sx={{ bgcolor: 'background.surface' }}
                      >
                        <KeyboardArrowLeftIcon />
                      </IconButton>
                      <IconButton
                        size="sm"
                        color="neutral"
                        variant="outlined"
                        disabled={(page + 1) * rowsPerPage >= totalCount ? true : false}
                        onClick={() => setPage(page + 1)}
                        sx={{ bgcolor: 'background.surface' }}
                      >
                        <KeyboardArrowRightIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </td>
              </tr>
            </tfoot>
          </Table>
        </Sheet>
      </td>
    </tr>
  )
}

PermissionTable.propTypes = {
  roleId: PropTypes.string.isRequired,
}
