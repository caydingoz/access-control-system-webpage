import React, { useEffect } from 'react'
import { Box, Table, Typography, Sheet, Checkbox, IconButton, Tooltip } from '@mui/joy'
import { Stack, Avatar, Chip, Menu, MenuItem } from '@mui/joy'
import { IconButton as RsuiteIconButton } from 'rsuite'
import UserInfo from './UserInfo'
import UserService from 'src/services/UserService'
import RoleManagementService from 'src/services/RoleManagementService'
import { format } from 'date-fns'
import PlusIcon from '@rsuite/icons/Plus'
import TrashIcon from '@rsuite/icons/Trash'
import FunnelIcon from '@rsuite/icons/Funnel'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import 'src/css/style.css'
import { useSelector } from 'react-redux'
import PermissionChecker from '../../helpers/permissionChecker'
import { PermissionTypes } from '../../enums/PermissionTypes'
import UserTableHeader from './UserTableHeader'
import UserTableFooter from './UserTableFooter'
import UserTableFilterForm from './UserTableFilterForm'

export default function UserTable() {
  const userPermissions = useSelector((state) => state.auth.permissions)
  const [filterName, setFilterName] = React.useState(null)
  const [filterStatus, setFilterStatus] = React.useState(null)
  const [filterRoles, setFilterRoles] = React.useState(null)
  const [order, setOrder] = React.useState('asc')
  const [orderBy, setOrderBy] = React.useState('firstName')
  const [selectedUsers, setSelectedUsers] = React.useState([])
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [totalCount, setTotalCount] = React.useState(0)
  const [users, setUsers] = React.useState([])
  const [visibleUserInfo, setVisibleUserInfo] = React.useState(false)
  const [updatedUserId, setUpdatedUserId] = React.useState(null)
  const [roles, setRoles] = React.useState([])
  const [optionsMenuAnchorEl, setOptionsMenuAnchorEl] = React.useState(null)
  const menuRef = React.useRef(null)

  function formatDateTime(inputDateTime) {
    const date = new Date(inputDateTime)
    return format(date, 'dd-MM-yyyy')
  }

  useEffect(() => {
    //close modal if clicked outside
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
    //hide scroll when update model opened
    if (visibleUserInfo) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [visibleUserInfo])

  useEffect(() => {
    async function fetchData() {
      await getAllRoles()
      const res = await UserService.getUsersAsync(page, rowsPerPage, filterStatus, order, orderBy, filterName, filterRoles)
      if (res.success) {
        setUsers(res.data.users)
        setTotalCount(res.data.totalCount)
      }
    }
    fetchData()
  }, [page, rowsPerPage, order, orderBy, filterName, filterStatus, filterRoles])

  const deleteUsers = async () => {
    var res = await UserService.deleteUsersAsync(selectedUsers)
    if (res.success) {
      await getUsers()
    }
  }

  const getAllRoles = async () => {
    var res = await RoleManagementService.getRolesAsync(0, 10000)
    if (res.success) {
      setRoles(res.data.roles.map((item) => ({ label: item.name, value: item.id })))
    }
  }

  const getUsers = async () => {
    const res = await UserService.getUsersAsync(page, rowsPerPage, filterStatus, order, orderBy, filterName, filterRoles)
    if (res.success) {
      setUsers(res.data.users)
      setTotalCount(res.data.totalCount)
      setSelectedUsers([])
    }
  }

  const handleAddNewUser = async (newUser) => {
    setVisibleUserInfo(false)
    var res = await UserService.addUserAsync(newUser)
    if (res.success) {
      await getUsers()
    }
  }

  const handleCloseUserInfo = () => {
    setVisibleUserInfo(false)
    setUpdatedUserId(null)
  }

  const handleUpdateUser = async (user) => {
    var res = await UserService.updateUserAsync(user)
    if (res.success) {
      await getUsers()
    }
  }

  const handleOpenUpdateUser = () => {
    setVisibleUserInfo(true)
    setOptionsMenuAnchorEl(null)
  }

  const handleOptionsMenu = (event, userId) => {
    setOptionsMenuAnchorEl(optionsMenuAnchorEl && event.currentTarget === optionsMenuAnchorEl ? null : event.currentTarget)
    setUpdatedUserId(userId)
  }

  const handleCloseOptionsMenu = () => {
    setOptionsMenuAnchorEl(null)
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
    setUsers([])
    setRowsPerPage(parseInt(newValue.toString(), 10))
    setPage(0)
  }

  const emptyRows = Math.max(0, rowsPerPage - users.length)

  const userStatus = {
    0: { status: 'Passive', color: 'warning' },
    1: { status: 'Active', color: 'success' },
    2: { status: 'Deleted', color: 'danger' },
  }
  const userStatusData = Object.values(userStatus).map((item) => ({ label: item.status, value: item.status }))

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
            Users
            <br />
            <Typography level="body-xs" sx={{ fontWeight: 'normal' }}>
              The Users table stores information about individuals who have access to the application, including their credentials, roles, and
              relevant user details.
            </Typography>
          </Typography>
        </Box>
        <UserTableFilterForm
          roles={roles}
          userStatusData={userStatusData}
          setFilterName={setFilterName}
          setFilterStatus={setFilterStatus}
          setFilterRoles={setFilterRoles}
        />
        <Box>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              justifyContent: 'space-between',
            }}
          >
            <div style={{ marginLeft: '2%', width: '100px' }}>
              {PermissionChecker.hasPermission(userPermissions, 'User', PermissionTypes.Write) && (
                <RsuiteIconButton
                  appearance="primary"
                  icon={<PlusIcon />}
                  color="green"
                  size="xs"
                  style={{ width: '100%', fontSize: '13px' }}
                  onClick={() => {
                    setVisibleUserInfo(true)
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.01)'
                    e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 128, 0, 0.3)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  Add User
                </RsuiteIconButton>
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
            width: '96%',
            margin: '1% 2% 2% 2%',
            '--TableCell-selectedBackground': (theme) => theme.vars.palette.primary.softBg,
            '& tbody tr': {
              height: '57px',
            },
            '& thead th:nth-of-type(1)': {
              width: '41px',
            },
            '& thead th:nth-of-type(2)': {
              width: '60px',
            },
            '& thead th:nth-of-type(3)': {
              width: '28%',
            },
            '& thead th:nth-of-type(4)': {
              width: '9%',
            },
            '& thead th:nth-of-type(8)': {
              width: '90px',
            },
            '& thead th:last-of-type': {
              width: '50px',
            },
            '& tfoot td': {
              backgroundColor: (theme) => theme.vars.palette.background.surface,
            },
          }}
        >
          <UserTableHeader
            order={order}
            orderBy={orderBy}
            handleOrder={handleOrder}
            handleSelectAllUsers={handleSelectAllUsers}
            users={users}
            selectedUsers={selectedUsers}
            userPermissions={userPermissions}
          />

          <tbody>
            {users.map((row, index) => {
              const isItemSelected = selectedUsers.indexOf(row.id) !== -1
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
                        sx={{
                          verticalAlign: 'top',
                          marginLeft: '5px',
                          pointerEvents: PermissionChecker.hasPermission(userPermissions, 'User', PermissionTypes.Delete) ? 'auto' : 'none',
                        }}
                        disabled={!PermissionChecker.hasPermission(userPermissions, 'User', PermissionTypes.Delete)}
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
                      <Chip color={userStatus[row.status].color} size="sm" sx={{ padding: '0 10px' }}>
                        {userStatus[row.status].status}
                      </Chip>
                    </td>
                    <td id={labelId}>
                      <Typography level="body-sm">{row.phoneNumber}</Typography>
                    </td>
                    <td id={labelId}>
                      <Typography level="body-sm">{row.title}</Typography>
                    </td>
                    <td id={labelId}>
                      {row.roles.map((role, index) => {
                        return (
                          <Chip key={index} size="sm" sx={{ marginRight: '3px' }}>
                            {role.name}
                          </Chip>
                        )
                      })}
                    </td>
                    <td id={labelId}>
                      <Typography level="body-sm">{formatDateTime(row.createdAt)}</Typography>
                    </td>
                    <td id={labelId}>
                      {PermissionChecker.hasPermission(userPermissions, 'User', PermissionTypes.Write) && (
                        <>
                          <IconButton size="sm" onClick={(event) => handleOptionsMenu(event, row.id)}>
                            <MoreVertIcon />
                          </IconButton>
                          <Menu
                            sx={{ p: 0, boxShadow: '0px 0.1px 2px rgba(0, 0, 0, 0.1)' }}
                            anchorEl={optionsMenuAnchorEl}
                            open={Boolean(optionsMenuAnchorEl)}
                            onClose={handleCloseOptionsMenu}
                            placement="bottom-end"
                            ref={menuRef}
                            size="sm"
                          >
                            <MenuItem sx={{ height: '20px', width: 100, p: 1 }} onClick={() => handleOpenUpdateUser()} size="sm">
                              <EditIcon fontSize="small" />
                              <Typography level="body-sm">Edit</Typography>
                            </MenuItem>
                          </Menu>
                        </>
                      )}
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
                <td colSpan={9} aria-hidden />
              </tr>
            )}
          </tbody>
          <UserTableFooter
            rowsPerPage={rowsPerPage}
            totalCount={totalCount}
            page={page}
            setPage={setPage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Table>
        {visibleUserInfo && (
          <div className="overlay">
            <div style={{ width: 400 }}>
              <UserInfo
                user={users.find((user) => user.id === updatedUserId)}
                isNew={updatedUserId === null}
                onClose={handleCloseUserInfo}
                roles={roles}
                onSubmit={updatedUserId === null ? handleAddNewUser : handleUpdateUser}
              />
            </div>
          </div>
        )}
      </Sheet>
    </div>
  )
}
