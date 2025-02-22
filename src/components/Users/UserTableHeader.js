import React from 'react'
import { Checkbox, Link } from '@mui/joy'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import RemoveIcon from '@mui/icons-material/Remove'
import PermissionChecker from '../../helpers/permissionChecker'
import { PermissionTypes } from '../../enums/PermissionTypes'

const UserTableHeader = ({ order, orderBy, handleOrder, handleSelectAllUsers, users, selectedUsers, userPermissions }) => {
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
      id: 'phoneNumber',
      label: 'Phone Number',
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
      label: 'Create Date',
    },
  ]
  return (
    <thead>
      <tr>
        <th>
          <Checkbox
            checked={users.length > 0 && selectedUsers.length >= users.length}
            checkedIcon={<RemoveIcon />}
            color="primary"
            onChange={handleSelectAllUsers}
            sx={{ verticalAlign: 'sub', marginLeft: '5px' }}
            disabled={!PermissionChecker.hasPermission(userPermissions, 'User', PermissionTypes.Delete)}
          />
        </th>
        <th />
        {headCells.map((headCell) => {
          const active = orderBy === headCell.id
          return (
            <th key={headCell.id} aria-sort={active ? { asc: 'ascending', desc: 'descending' }[order] : undefined} style={{ verticalAlign: 'top' }}>
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
  )
}

export default UserTableHeader
