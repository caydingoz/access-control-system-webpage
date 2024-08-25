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
import Link from '@mui/joy/Link'
import Tooltip from '@mui/joy/Tooltip'
import Select from '@mui/joy/Select'
import Option from '@mui/joy/Option'
import DeleteIcon from '@mui/icons-material/Delete'
import FilterListIcon from '@mui/icons-material/FilterList'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import RemoveIcon from '@mui/icons-material/Remove'
import RoleManagementService from 'src/services/RoleManagementService'
import { format } from 'date-fns'
import FlagChecker from '../../helpers/flagChecker'
import { Input, Button } from '@mui/joy'
import CloseIcon from '@mui/icons-material/Close'

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

const headCells = [
  {
    id: 'name',
    label: 'Name',
  },
  {
    id: 'createdAt',
    label: 'Create Date',
  },
  {
    id: 'updatedAt',
    label: 'Update Date',
  },
]

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }

  return (
    <thead>
      <tr>
        <th>
          <Checkbox
            checked={rowCount > 0 && numSelected >= rowCount}
            checkedIcon={<RemoveIcon />}
            color="primary"
            onChange={onSelectAllClick}
            sx={{ verticalAlign: 'sub', paddingLeft: '4px' }}
          />
        </th>
        <th />
        {headCells.map((headCell) => {
          const active = orderBy === headCell.id
          return (
            <th key={headCell.id} aria-sort={active ? { asc: 'ascending', desc: 'descending' }[order] : undefined}>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <Link
                underline="none"
                color="neutral"
                textColor={active ? 'primary.plainColor' : undefined}
                component="button"
                onClick={createSortHandler(headCell.id)}
                fontWeight="lg"
                endDecorator={<ArrowDownwardIcon sx={{ opacity: active ? 1 : 0 }} />}
                sx={{
                  '& svg': {
                    transition: '0.2s',
                    transform: active && order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)',
                  },
                  '&:hover': { '& svg': { opacity: 1 } },
                }}
              >
                {headCell.label}
              </Link>
            </th>
          )
        })}
      </tr>
    </thead>
  )
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
}

function PermissionTest(props) {
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
        <Sheet variant="soft" sx={{ p: 1, pl: 4, boxShadow: 'inset 0 3px 6px 0 rgba(0 0 0 / 0.08)' }}>
          <Typography level="body-md" component="div">
            Permissions
          </Typography>
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
                    <td>{permission.operation}</td>
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
                    <td>{formatDateTime(permission.createdAt)}</td>
                    <td>{formatDateTime(permission.updatedAt)}</td>
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

PermissionTest.propTypes = {
  roleId: PropTypes.string.isRequired,
}

export default function TableSortAndSelection() {
  const [filterName, setFilterName] = React.useState(null)
  const [order, setOrder] = React.useState('asc')
  const [orderBy, setOrderBy] = React.useState('name')
  const [selectedRoles, setSelectedRoles] = React.useState([])
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [totalCount, setTotalCount] = React.useState(0)
  const [roles, setRoles] = React.useState([])
  const [openedId, setOpenedId] = React.useState()

  useEffect(() => {
    async function fetchData() {
      const res = await RoleManagementService.getRolesAsync(page, rowsPerPage, order, orderBy, filterName)
      if (res.success) {
        setRoles(res.data.roles)
        setTotalCount(res.data.totalCount)
      }
    }

    fetchData()
  }, [page, rowsPerPage, order, orderBy, filterName])

  const deleteRoles = async () => {
    var res = await RoleManagementService.deleteRolesAsync(selectedRoles)
    if (res.success) {
      const rolesData = await RoleManagementService.getRolesAsync(page, rowsPerPage, order, orderBy)
      setRoles(rolesData.data.roles)
      setTotalCount(rolesData.data.totalCount)
      setSelectedRoles([])
    }
  }

  const handleOrder = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleCollapse = async (id) => {
    const isOpened = openedId === id
    setOpenedId(isOpened ? undefined : id)
  }

  const handleSelectAllRoles = (event) => {
    if (event.target.checked) {
      const newSelected = roles.map((n) => n.id)
      setSelectedRoles(newSelected)
      return
    }
    setSelectedRoles([])
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

  const handleChangeRowsPerPage = (event, newValue) => {
    setRowsPerPage(parseInt(newValue.toString(), 10))
    setPage(0)
  }

  const isSelected = (id) => selectedRoles.indexOf(id) !== -1

  const emptyRows = Math.max(0, rowsPerPage - roles.length)

  return (
    <div>
      <Sheet variant="outlined" sx={{ width: '100%', boxShadow: 'sm', borderRadius: 'sm', marginTop: '20px' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            padding: '1%',
            borderTopLeftRadius: 'var(--unstable_actionRadius)',
            borderTopRightRadius: 'var(--unstable_actionRadius)',
          }}
        >
          <Typography level="h4" sx={{ flex: '1 1 100%' }}>
            Roles
          </Typography>
          {selectedRoles.length > 0 && (
            <Typography level="body-sm" display="inline" sx={{ flex: '1 1 30%', textAlign: 'right', paddingRight: '5px' }} component="div">
              {selectedRoles.length} selected
            </Typography>
          )}

          {selectedRoles.length > 0 ? (
            <Tooltip title="Delete">
              <IconButton size="sm" color="danger" variant="solid" onClick={async () => await deleteRoles()}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Filter list">
              <IconButton size="sm" variant="outlined" color="neutral" disabled>
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            const formElements = event.currentTarget.elements
            setFilterName(formElements.name.value)
          }}
        >
          <Sheet
            variant="outlined"
            sx={{
              width: '96%',
              margin: '1% 2%',
              padding: '15px',
              borderRadius: 'md',
              boxShadow: 'md',
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
              <Box sx={{ flex: 1, minWidth: 250 }}>
                <Typography level="title-sm" sx={{ mb: 1 }}>
                  What are you looking for?
                </Typography>
                <Input
                  name="name"
                  placeholder="Search for role, permission, etc."
                  variant="outlined"
                  size="sm"
                  sx={{
                    width: '100%',
                    borderRadius: 'md',
                    boxShadow: 'sm',
                  }}
                />
              </Box>

              <Box sx={{ minWidth: 180 }}>
                <Typography level="title-sm" sx={{ mb: 1 }}>
                  Category
                </Typography>
                <Select
                  size="sm"
                  placeholder="All"
                  variant="outlined"
                  sx={{
                    width: '100%',
                    borderRadius: 'md',
                    boxShadow: 'sm',
                  }}
                >
                  <Option value="all">All</Option>
                  <Option value="category1">Category 1</Option>
                  <Option value="category2">Category 2</Option>
                </Select>
              </Box>

              <Box sx={{ minWidth: 180 }}>
                <Typography level="title-sm" sx={{ mb: 1 }}>
                  Status
                </Typography>
                <Select
                  size="sm"
                  placeholder="All"
                  variant="outlined"
                  sx={{
                    width: '100%',
                    borderRadius: 'md',
                    boxShadow: 'sm',
                  }}
                >
                  <Option value="all">All</Option>
                  <Option value="status1">Status 1</Option>
                  <Option value="status2">Status 2</Option>
                </Select>
              </Box>

              <Button
                type="submit"
                variant="solid"
                size="sm"
                sx={{
                  padding: '0 32px',
                  borderRadius: 'md',
                  background: 'linear-gradient(45deg, #007FFF, #0059B2)',
                  boxShadow: 'md',
                  minWidth: 120,
                }}
              >
                Search
              </Button>
            </Box>
          </Sheet>
        </form>
        <Table
          hoverRow
          size="md"
          variant="outlined"
          sx={{
            borderRadius: 'md',
            boxShadow: 'md',
            width: '96%',
            margin: '2% 2%',
            '--TableCell-headBackground': 'transparent',
            '--TableCell-selectedBackground': (theme) => theme.vars.palette.primary.softBg,
            '& tbody tr': {
              height: '41px',
            },
            '& thead th:nth-of-type(1)': {
              width: '40px',
            },
            '& thead th:nth-of-type(2)': {
              width: '40px',
            },
            '& th': {
              backgroundColor: 'background.level1',
              height: '40px',
            },
          }}
        >
          <EnhancedTableHead
            numSelected={selectedRoles.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllRoles}
            onRequestSort={handleOrder}
            rowCount={roles.length}
          />
          <tbody>
            {roles.map((row, index) => {
              const isItemSelected = isSelected(row.id)
              const labelId = `enhanced-table-checkbox-${index}`
              const fragmentKey = `row-${index}`

              return (
                <React.Fragment key={fragmentKey}>
                  <tr
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    style={
                      isItemSelected
                        ? {
                            '--TableCell-dataBackground': 'var(--TableCell-selectedBackground)',
                            '--TableCell-headBackground': 'var(--TableCell-selectedBackground)',
                          }
                        : {}
                    }
                  >
                    <td>
                      <Checkbox
                        onClick={(event) => handleSelectRole(event, row.id)}
                        checked={isItemSelected}
                        checkedIcon={<CloseIcon fontSize="sm" />}
                        color="danger"
                        slotProps={{
                          input: {
                            'aria-labelledby': labelId,
                          },
                        }}
                        sx={{ verticalAlign: 'top', paddingLeft: '4px' }}
                      />
                    </td>
                    <td
                      style={{
                        padding: '4px',
                        alignItems: 'center',
                      }}
                    >
                      <IconButton
                        color="neutral"
                        sx={{ display: 'flex', justifyContent: 'center' }} //TODO: burayı kaldırırsan table height bozuluyor?
                        size="sm"
                        onClick={async () => await handleCollapse(row.id)}
                      >
                        {openedId === row.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton>
                    </td>
                    <td id={labelId}> {row.name} </td>
                    <td>{formatDateTime(row.createdAt)}</td>
                    <td>{formatDateTime(row.updatedAt)}</td>
                  </tr>
                  {openedId === row.id && <PermissionTest roleId={openedId} />}
                </React.Fragment>
              )
            })}
            {emptyRows > 0 && (
              <tr
                style={{
                  height: `calc(${emptyRows} * 41px)`,
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
    </div>
  )
}
