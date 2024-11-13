import React, { useEffect } from 'react'
import Box from '@mui/joy/Box'
import Table from '@mui/joy/Table'
import Typography from '@mui/joy/Typography'
import Sheet from '@mui/joy/Sheet'
import Checkbox from '@mui/joy/Checkbox'
import FormControl from '@mui/joy/FormControl'
import FormLabel from '@mui/joy/FormLabel'
import IconButton from '@mui/joy/IconButton'
import Tooltip from '@mui/joy/Tooltip'
import Select from '@mui/joy/Select'
import Option from '@mui/joy/Option'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import RoleManagementService from 'src/services/RoleManagementService'
import { Button, Stack, Card } from '@mui/joy'
import CloseIcon from '@mui/icons-material/Close'
import { DateRangePicker, Input, SelectPicker } from 'rsuite'
import PermissionTable from './PermissionTable'
import { format } from 'date-fns'
import Link from '@mui/joy/Link'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import RemoveIcon from '@mui/icons-material/Remove'
import { IconButton as RsuiteIconButton } from 'rsuite'
import { Button as RsuiteButton } from 'rsuite'
import PlusIcon from '@rsuite/icons/Plus'
import TrashIcon from '@rsuite/icons/Trash'
import FunnelIcon from '@rsuite/icons/Funnel'
import RsuiteCloseIcon from '@rsuite/icons/Close'

export default function RoleTable() {
  const [filterName, setFilterName] = React.useState(null)
  const [filterPermissions, setFilterPermissions] = React.useState(null)
  const [order, setOrder] = React.useState('asc')
  const [orderBy, setOrderBy] = React.useState('name')
  const [selectedRoles, setSelectedRoles] = React.useState([])
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [totalCount, setTotalCount] = React.useState(0)
  const [roles, setRoles] = React.useState([])
  const [permissions, setPermissions] = React.useState([])
  const [openedId, setOpenedId] = React.useState()
  const [visibleAddRole, setVisibleAddRole] = React.useState(false)
  const [newRole, setNewRole] = React.useState('')

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

  useEffect(() => {
    async function fetchData() {
      const roleRes = await RoleManagementService.getRolesAsync(page, rowsPerPage, order, orderBy, filterPermissions, filterName)
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
  }, [page, rowsPerPage, order, orderBy, filterPermissions, filterName])

  const deleteRoles = async () => {
    var res = await RoleManagementService.deleteRolesAsync(selectedRoles)
    if (res.success) {
      const rolesData = await RoleManagementService.getRolesAsync(page, rowsPerPage, order, orderBy, filterPermissions, filterName)
      setRoles(rolesData.data.roles)
      setTotalCount(rolesData.data.totalCount)
      setSelectedRoles([])
    }
  }

  const handleAddNewRole = async () => {
    setVisibleAddRole(false)
    var res = await RoleManagementService.addRoleAsync(newRole)
    if (res.success) {
      const rolesData = await RoleManagementService.getRolesAsync(page, rowsPerPage, order, orderBy, filterPermissions, filterName)
      setRoles(rolesData.data.roles)
      setTotalCount(rolesData.data.totalCount)
      setSelectedRoles([])
    }
  }

  const handleNewRoleName = (value) => {
    setNewRole(value)
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
                    borderRadius: 'sm',
                    boxShadow: 'sm',
                    backgroundColor: 'transparent',
                  }}
                />
              </Box>
              <Box sx={{ minWidth: 180 }}>
                <Typography level="title-sm" sx={{ mb: 1 }}>
                  Date
                </Typography>
                <DateRangePicker
                  size="sm"
                  style={{
                    width: '100%',
                    borderRadius: 'sm',
                    boxShadow: 'sm',
                    backgroundColor: 'transparent',
                  }}
                />
              </Box>
              <Box sx={{ minWidth: 180 }}>
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
                      style={{ width: '20%', fontSize: '12px', height: '27px', borderRadius: '30px' }}
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
        <Table
          hoverRow
          size="md"
          variant="outlined"
          sx={{
            width: '96%',
            margin: '1% 2% 2% 2%',
            '--TableCell-selectedBackground': (theme) => theme.vars.palette.primary.softBg,
            '& tbody tr': {
              height: '40px',
            },
            '& thead th:nth-of-type(1)': {
              width: '40px',
            },
            '& thead th:nth-of-type(2)': {
              width: '40px',
            },
            '& th': {
              height: '40px',
            },
            '& tfoot td': {
              backgroundColor: (theme) => theme.vars.palette.background.surface,
            },
          }}
        >
          <thead>
            <tr>
              <th />
              <th>
                <Checkbox
                  checked={roles.length > 0 && selectedRoles.length >= roles.length}
                  checkedIcon={<RemoveIcon />}
                  color="primary"
                  onChange={handleSelectAllRoles}
                  sx={{ verticalAlign: 'sub' }}
                />
              </th>
              {headCells.map((headCell) => {
                const active = orderBy === headCell.id
                return (
                  <th
                    key={headCell.id}
                    aria-sort={active ? { asc: 'ascending', desc: 'descending' }[order] : undefined}
                    style={{ verticalAlign: 'middle' }}
                  >
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <Link
                      underline="none"
                      color="neutral"
                      textColor={active ? 'primary.plainColor' : undefined}
                      component="button"
                      onClick={(event) => handleOrder(event, headCell.id)}
                      fontWeight="lg"
                      endDecorator={<ArrowDownwardIcon sx={{ opacity: active ? 1 : 0 }} />}
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        height: '100%',
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
                    <td
                      style={{
                        padding: '4px',
                        alignItems: 'center',
                      }}
                    >
                      <IconButton color="neutral" size="sm" onClick={async () => await handleCollapse(row.id)}>
                        {openedId === row.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton>
                    </td>
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
                        sx={{ verticalAlign: 'top' }}
                      />
                    </td>
                    <td id={labelId}>
                      <Typography level="body-sm">{row.name}</Typography>
                    </td>
                    <td id={labelId}>
                      <Typography level="body-sm">{formatDateTime(row.createdAt)}</Typography>
                    </td>
                    <td id={labelId}>
                      <Typography level="body-sm">{formatDateTime(row.updatedAt)}</Typography>
                    </td>
                  </tr>
                  {openedId === row.id && <PermissionTable roleId={openedId.toString()} />}
                </React.Fragment>
              )
            })}
            {emptyRows > 0 && (
              <tr
                style={{
                  height: `calc((${emptyRows} * 40.72px) - 0.72px)`,
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
                  <FormControl orientation="horizontal" size="sm" sx={{ width: '5%' }}>
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
