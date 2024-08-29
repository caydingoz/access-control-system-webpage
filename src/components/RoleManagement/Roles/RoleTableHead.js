import React from 'react'
import PropTypes from 'prop-types'
import Checkbox from '@mui/joy/Checkbox'
import Link from '@mui/joy/Link'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import RemoveIcon from '@mui/icons-material/Remove'

export default function EnhancedTableHead(props) {
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
                onClick={createSortHandler(headCell.id)}
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
