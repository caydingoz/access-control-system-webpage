import React, { useEffect } from 'react'
import { Box, Table, Typography, Sheet, Checkbox, FormControl, FormLabel, IconButton, Tooltip, Select, Option } from '@mui/joy'
import { Button, Stack, Card, Avatar, Chip, Menu, MenuItem, Link } from '@mui/joy'
import { DateRangePicker, Input, InputGroup, SelectPicker, TagPicker } from 'rsuite'
import { IconButton as RsuiteIconButton, Button as RsuiteButton } from 'rsuite'
import UserService from 'src/services/UserService'
import RoleManagementService from 'src/services/RoleManagementService'
import { format } from 'date-fns'
import PlusIcon from '@rsuite/icons/Plus'
import TrashIcon from '@rsuite/icons/Trash'
import FunnelIcon from '@rsuite/icons/Funnel'
import RsuiteCloseIcon from '@rsuite/icons/Close'
import UserBadgeIcon from '@rsuite/icons/UserBadge'
import LocationIcon from '@rsuite/icons/Location'
import PhoneIcon from '@rsuite/icons/Phone'
import RemoveIcon from '@mui/icons-material/Remove'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import CloseIcon from '@mui/icons-material/Close'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import EditIcon from '@mui/icons-material/Edit'

export default function UserTable() {
  const [filterName, setFilterName] = React.useState(null)
  const [filterStatus, setFilterStatus] = React.useState(null)
  const [order, setOrder] = React.useState('asc')
  const [orderBy, setOrderBy] = React.useState('firstName')
  const [selectedUsers, setSelectedUsers] = React.useState([])
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [totalCount, setTotalCount] = React.useState(0)
  const [users, setUsers] = React.useState([])
  const [visibleAddUser, setVisibleAddUser] = React.useState(false)
  const [newUser, setNewUser] = React.useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    title: '',
    roleIds: [],
  })
  const [roles, setRoles] = React.useState([])
  const [optionsMenuAnchorEl, setOptionsMenuAnchorEl] = React.useState(null)
  const menuRef = React.useRef(null)

  function formatDateTime(inputDateTime) {
    const date = new Date(inputDateTime)
    return format(date, 'dd-MM-yyyy')
  }

  const headCells = [
    {
      id: 'firstName',
      label: 'Name',
    },
    {
      id: 'status',
      label: 'Status',
    },
    {
      id: 'title',
      label: 'Title',
    },
    {
      id: 'roles',
      label: 'Roles',
    },
    {
      id: 'createdAt',
      label: 'CreateDate',
    },
  ]
  const userStatus = {
    0: { status: 'Passive', color: 'warning' },
    1: { status: 'Active', color: 'success' },
    2: { status: 'Deleted', color: 'danger' },
  }

  const userStatusData = Object.values(userStatus).map((item) => ({ label: item.status, value: item.status }))

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && optionsMenuAnchorEl) {
        handleCloseOptionsMenu()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [optionsMenuAnchorEl])

  useEffect(() => {
    async function fetchData() {
      const res = await UserService.getUsersAsync(page, rowsPerPage, filterStatus, order, orderBy, filterName)
      if (res.success) {
        setUsers(res.data.users)
        setTotalCount(res.data.totalCount)
      }
    }

    fetchData()
  }, [page, rowsPerPage, order, orderBy, filterName, filterStatus])

  const deleteUsers = async () => {
    var res = await UserService.deleteUsersAsync(selectedUsers)
    if (res.success) {
      const usersData = await UserService.getUsersAsync(page, rowsPerPage, filterStatus, order, orderBy)
      setUsers(usersData.data.users)
      setTotalCount(usersData.data.totalCount)
      setSelectedUsers([])
    }
  }

  const getAllRoles = async () => {
    var res = await RoleManagementService.getRolesAsync(0, 10000, 'asc', 'name')
    if (res.success) {
      setRoles(res.data.roles.map((item) => ({ label: item.name, value: item.id })))
    }
  }

  const handleOptionsMenu = (event) => {
    setOptionsMenuAnchorEl(optionsMenuAnchorEl && event.currentTarget === optionsMenuAnchorEl ? null : event.currentTarget)
  }

  const handleCloseOptionsMenu = () => {
    setOptionsMenuAnchorEl(null)
  }

  const handleAddNewUser = async () => {
    setVisibleAddUser(false)
    var res = await UserService.addUserAsync(newUser)
    if (res.success) {
      const usersData = await UserService.getUsersAsync(page, rowsPerPage, filterStatus, order, orderBy)
      setUsers(usersData.data.users)
      setTotalCount(usersData.data.totalCount)
      setSelectedUsers([])
    }
  }

  const handleInputChangeForNewUser = (key, value) => {
    setNewUser({
      ...newUser,
      [key]: value,
    })
  }

  const handleOrder = (event, property) => {
    if (property !== 'roles') {
      const isAsc = orderBy === property && order === 'asc'
      setOrder(isAsc ? 'desc' : 'asc')
      setOrderBy(property)
    }
  }

  const handleSelectAllUsers = (event) => {
    if (event.target.checked) {
      const newSelected = users.map((n) => n.id)
      setSelectedUsers(newSelected)
      return
    }
    setSelectedUsers([])
  }

  const handleSelectUser = (event, id) => {
    const selectedIndex = selectedUsers.indexOf(id)
    let newSelectedUsers = []

    if (selectedIndex === -1) {
      newSelectedUsers = newSelectedUsers.concat(selectedUsers, id)
    } else if (selectedIndex === 0) {
      newSelectedUsers = newSelectedUsers.concat(selectedUsers.slice(1))
    } else if (selectedIndex === selectedUsers.length - 1) {
      newSelectedUsers = newSelectedUsers.concat(selectedUsers.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelectedUsers = newSelectedUsers.concat(selectedUsers.slice(0, selectedIndex), selectedUsers.slice(selectedIndex + 1))
    }

    setSelectedUsers(newSelectedUsers)
  }

  const handleChangeRowsPerPage = (event, newValue) => {
    setRowsPerPage(parseInt(newValue.toString(), 10))
    setPage(0)
  }

  const isSelected = (id) => selectedUsers.indexOf(id) !== -1

  const emptyRows = Math.max(0, rowsPerPage - users.length)

  return (
    <div>
      <Sheet variant="outlined" sx={{ width: '100%', boxShadow: 'sm', borderRadius: 'sm', backgroundColor: 'transparent' }}>
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
            Users
            <br></br>
            <Typography level="body-xs" sx={{ fontWeight: 'normal' }}>
              The Users table stores information about individuals who have access to the application, including their credentials, roles, and
              relevant user details.
            </Typography>
          </Typography>
        </Box>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            const formElements = event.currentTarget.elements
            setFilterName(formElements.name.value)
            setFilterStatus(formElements.status.value)
          }}
        >
          <Sheet
            variant="outlined"
            sx={{
              width: '96%',
              margin: '1% 2%',
              padding: '15px',
              borderRadius: 'sm',
              boxShadow: 'sm',
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
                  placeholder="Search for name, email, etc."
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
              <Box sx={{ width: 180 }}>
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
                    backgroundColor: 'transparent',
                  }}
                  searchable={false}
                  menuStyle={{ width: 180 }}
                  data={userStatusData}
                ></SelectPicker>
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
                    background: 'linear-gradient(45deg, #2A8DEB, #105CA8)', // Darker or different gradient on hover
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
                onClick={() => {
                  setVisibleAddUser((prev) => !prev)
                  getAllRoles()
                }}
              >
                Add User
              </RsuiteIconButton>
              {visibleAddUser && (
                <Card
                  sx={{
                    position: 'absolute',
                    left: '1.6%',
                    marginTop: '5px',
                    width: 400,
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
                      New User
                      <br></br>
                      <Typography level="body-xs" sx={{ fontWeight: 'normal' }}>
                        Please fill in the fields below to create a new user.
                      </Typography>
                    </Typography>
                    <div>
                      <RsuiteIconButton
                        color="red"
                        appearance="primary"
                        onClick={() => setVisibleAddUser(false)}
                        size="xs"
                        icon={<RsuiteCloseIcon />}
                      />
                    </div>
                  </Stack>
                  <Stack direction="column" spacing={1}>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <IconButton
                        variant="outlined"
                        sx={{
                          width: 100,
                          height: 120,
                          borderRadius: '5px',
                          backgroundColor: 'white',
                        }}
                      >
                        <AddAPhotoIcon />
                      </IconButton>
                      <Stack direction="column" spacing={1}>
                        <InputGroup style={{ width: 250, fontSize: '12px' }}>
                          <InputGroup.Addon>
                            <LocationIcon />
                          </InputGroup.Addon>
                          <Input
                            value={newUser.firstName}
                            size="sm"
                            placeholder="First name.."
                            style={{ fontSize: '12px' }}
                            onChange={(value) => handleInputChangeForNewUser('firstName', value)}
                          />
                        </InputGroup>
                        <InputGroup style={{ width: 250, fontSize: '12px' }}>
                          <InputGroup.Addon>
                            <LocationIcon />
                          </InputGroup.Addon>
                          <Input
                            value={newUser.lastName}
                            size="sm"
                            placeholder="Last name.."
                            style={{ fontSize: '12px' }}
                            onChange={(value) => handleInputChangeForNewUser('lastName', value)}
                          />
                        </InputGroup>
                        <InputGroup style={{ width: 250, fontSize: '12px' }}>
                          <InputGroup.Addon>
                            <PhoneIcon />
                          </InputGroup.Addon>
                          <Input
                            value={newUser.phoneNumber}
                            size="sm"
                            placeholder="Phone number.."
                            style={{ fontSize: '12px' }}
                            onChange={(value) => handleInputChangeForNewUser('phoneNumber', value)}
                          />
                        </InputGroup>
                        <InputGroup style={{ width: 250, fontSize: '12px' }}>
                          <InputGroup.Addon> @</InputGroup.Addon>
                          <Input
                            value={newUser.email}
                            size="sm"
                            placeholder="Email.."
                            style={{ fontSize: '12px' }}
                            onChange={(value) => handleInputChangeForNewUser('email', value)}
                          />
                        </InputGroup>
                        <InputGroup style={{ fontSize: '12px' }}>
                          <InputGroup.Addon>
                            <UserBadgeIcon />
                          </InputGroup.Addon>
                          <Input
                            value={newUser.title}
                            size="sm"
                            placeholder="Title.."
                            style={{ fontSize: '12px' }}
                            onChange={(value) => handleInputChangeForNewUser('title', value)}
                          />
                        </InputGroup>
                      </Stack>
                    </Stack>
                    <Typography level="body-sm" sx={{ fontSize: '13px' }}>
                      Roles
                    </Typography>
                    <TagPicker
                      size="xs"
                      placeholder="Select.."
                      style={{ fontSize: '12px', padding: '4px 0' }}
                      menuStyle={{ fontSize: '12px', zIndex: '50' }}
                      data={roles}
                      onChange={(selectedIds) => {
                        handleInputChangeForNewUser('roleIds', selectedIds)
                      }}
                    />
                    <RsuiteButton
                      appearance="primary"
                      color="green"
                      size="sm"
                      onClick={handleAddNewUser}
                      style={{ width: '20%', fontSize: '12px', height: '27px', borderRadius: '5px', marginLeft: 'auto', marginTop: '20px' }}
                    >
                      Add
                    </RsuiteButton>
                  </Stack>
                </Card>
              )}
            </div>
            {selectedUsers.length > 0 && (
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
                {selectedUsers.length} selected
              </Typography>
            )}
            {selectedUsers.length > 0 ? (
              <Tooltip title="Delete">
                <RsuiteIconButton
                  appearance="primary"
                  icon={<TrashIcon />}
                  color="red"
                  size="sm"
                  onClick={async () => await deleteUsers()}
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
            boxShadow: 'md',
            width: '96%',
            margin: '1% 2% 2% 2%',
            '--TableCell-selectedBackground': (theme) => theme.vars.palette.primary.softBg,
            '& tbody tr': {
              height: '57px',
            },
            '& thead th:nth-of-type(1)': {
              width: '40px',
            },
            '& thead th:nth-of-type(2)': {
              width: '60px',
            },
            '& thead th:nth-of-type(3)': {
              width: '28%',
            },
            '& thead th:nth-of-type(7)': {
              width: '14%',
            },
            '& thead th:last-of-type': {
              width: '50px',
            },
            '& tfoot td': {
              backgroundColor: (theme) => theme.vars.palette.background.surface,
            },
          }}
        >
          <thead>
            <tr>
              <th>
                <Checkbox
                  checked={users.length > 0 && selectedUsers.length >= users.length}
                  checkedIcon={<RemoveIcon />}
                  color="primary"
                  onChange={handleSelectAllUsers}
                  sx={{ verticalAlign: 'sub' }}
                />
              </th>
              <th />
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
                      endDecorator={<ArrowDownwardIcon sx={{ opacity: headCell.id === 'roles' ? 0 : active ? 1 : 0 }} />}
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        height: '100%',
                        '& svg': {
                          transition: '0.2s',
                          transform: active && order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)',
                        },
                        '&:hover': { '& svg': { opacity: headCell.id === 'roles' ? 0 : 1 } },
                      }}
                    >
                      {headCell.label}
                    </Link>
                  </th>
                )
              })}
              <th />
            </tr>
          </thead>
          <tbody>
            {users.map((row, index) => {
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
                        onClick={(event) => handleSelectUser(event, row.id)}
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
                      <Avatar src={`/images/${row.image}`} />
                    </td>
                    <td id={labelId}>
                      <Stack direction="column">
                        <Typography level="title-sm" sx={{ fontSize: '13px' }}>
                          {row.firstName + ' ' + row.lastName}
                        </Typography>
                        <Typography level="body-sm">{row.email}</Typography>
                      </Stack>
                    </td>
                    <td id={labelId}>
                      <Chip color={userStatus[row.status].color} size="sm">
                        {userStatus[row.status].status}
                      </Chip>
                    </td>
                    <td id={labelId}>
                      <Typography level="body-sm">{row.title}</Typography>
                    </td>
                    <td id={labelId}>
                      {row.roles.map((role, index) => {
                        return (
                          <Chip key={index} size="sm" sx={{ marginRight: '3px' }}>
                            {role}
                          </Chip>
                        )
                      })}
                    </td>
                    <td id={labelId}>
                      <Typography level="body-sm">{formatDateTime(row.createdAt)}</Typography>
                    </td>
                    <td id={labelId}>
                      <IconButton size="sm" onClick={handleOptionsMenu}>
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        sx={{ p: 0, boxShadow: '0px 0.2px 4px rgba(0, 0, 0, 0.1)' }}
                        anchorEl={optionsMenuAnchorEl}
                        open={Boolean(optionsMenuAnchorEl)}
                        onClose={handleCloseOptionsMenu}
                        placement="bottom-end"
                        ref={menuRef}
                        size="sm"
                      >
                        <MenuItem sx={{ height: '20px', width: 100, p: 1 }} onClick={handleCloseOptionsMenu} size="sm">
                          <EditIcon fontSize="small" />
                          <Typography level="body-sm">Edit</Typography>
                        </MenuItem>
                      </Menu>
                    </td>
                  </tr>
                </React.Fragment>
              )
            })}
            {emptyRows > 0 && (
              <tr
                style={{
                  height: `calc(${emptyRows} * 57px)`,
                  '--TableRow-hoverBackground': 'transparent',
                }}
              >
                <td colSpan={8} aria-hidden />
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={8}>
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
