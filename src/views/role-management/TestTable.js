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
import RoleManagementService from 'src/services/RoleManagementService'

function createData(id, name, createdAt, updatedAt) {
  return {
    id,
    name,
    createdAt,
    updatedAt,
    permissions: [
      {
        id: '2020-01-04',
        name: '11091700',
        createdAt: 3,
        updatedAt: 3,
      },
      {
        id: '2020-01-05',
        name: '11091701',
        createdAt: 3,
        updatedAt: 3,
      },
    ],
  }
}

function labelDisplayedRows({ from, to, count }) {
  return `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function getComparator(order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) {
      return order
    }
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
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
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            sx={{ verticalAlign: 'sub' }}
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

function EnhancedTableToolbar(props) {
  const { numSelected } = props

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        py: 1,
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: 'background.level1',
        }),
        borderTopLeftRadius: 'var(--unstable_actionRadius)',
        borderTopRightRadius: 'var(--unstable_actionRadius)',
      }}
    >
      <Typography level="body-lg" sx={{ flex: '1 1 100%' }} id="tableTitle" component="div">
        Roles
      </Typography>
      {numSelected > 0 && (
        //TODO: %8'i mobile göre 30'a ayarla
        <Typography display="inline" sx={{ flex: '1 1 8%' }} component="div">
          {numSelected} selected
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton size="sm" color="danger" variant="solid">
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
  )
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
}

export default function TableSortAndSelection() {
  const [order, setOrder] = React.useState('asc')
  const [orderBy, setOrderBy] = React.useState('name')
  const [selected, setSelected] = React.useState([])
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [data, setData] = React.useState([])
  const [open, setOpen] = React.useState(false)

  useEffect(() => {
    async function fetchData() {
      const res = await RoleManagementService.getRolesAsync(page, rowsPerPage, order, orderBy)
      const rolesData = res.data.roles.map((role) => createData(role.id, role.name, role.createdAt, role.updatedAt))
      setData(rolesData)
    }

    fetchData()
  }, [page, rowsPerPage, order, orderBy])

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n.name)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
    }

    setSelected(newSelected)
  }

  const handleChangePage = (newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event, newValue) => {
    setRowsPerPage(parseInt(newValue.toString(), 10))
    setPage(0)
  }

  const getLabelDisplayedRowsTo = () => {
    if (data.length === -1) {
      return (page + 1) * rowsPerPage
    }
    return rowsPerPage === -1 ? data.length : Math.min(data.length, (page + 1) * rowsPerPage)
  }

  const isSelected = (name) => selected.indexOf(name) !== -1

  const emptyRows = Math.max(0, (1 + page) * rowsPerPage - data.length)

  return (
    <Sheet variant="outlined" sx={{ width: '100%', boxShadow: 'sm', borderRadius: 'sm' }}>
      <EnhancedTableToolbar numSelected={selected.length} />
      <Table
        aria-labelledby="tableTitle"
        hoverRow
        sx={{
          '--TableCell-headBackground': 'transparent',
          '--TableCell-selectedBackground': (theme) => theme.vars.palette.success.softBg,
          '& thead th:nth-of-type(1)': {
            width: '30px',
          },
          '& thead th:nth-of-type(2)': {
            width: '40px',
          },
        }}
      >
        <EnhancedTableHead
          numSelected={selected.length}
          order={order}
          orderBy={orderBy}
          onSelectAllClick={handleSelectAllClick}
          onRequestSort={handleRequestSort}
          rowCount={data.length}
        />
        <tbody>
          {stableSort(data, getComparator(order, orderBy)).map((row, index) => {
            const isItemSelected = isSelected(row.id)
            const labelId = `enhanced-table-checkbox-${index}`
            const fragmentKey = `row-${index}`

            return (
              <React.Fragment key={fragmentKey}>
                <tr
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.id}
                  // selected={isItemSelected}
                  style={
                    isItemSelected
                      ? {
                          '--TableCell-dataBackground': 'var(--TableCell-selectedBackground)',
                          '--TableCell-headBackground': 'var(--TableCell-selectedBackground)',
                        }
                      : {}
                  }
                >
                  <th scope="row">
                    <Checkbox
                      onClick={(event) => handleClick(event, row.id)}
                      checked={isItemSelected}
                      slotProps={{
                        input: {
                          'aria-labelledby': labelId,
                        },
                      }}
                      sx={{ verticalAlign: 'top' }}
                    />
                  </th>
                  <th scope="row">
                    <IconButton aria-label="expand row" variant="plain" color="neutral" size="sm" onClick={() => setOpen(!open, row.id)}>
                      {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                  </th>
                  <th id={labelId} scope="row">
                    {row.name}
                  </th>
                  <td>{row.createdAt}</td>
                  <td>{row.updatedAt}</td>
                </tr>
                <tr>
                  <td style={{ height: 0, padding: 0 }} colSpan={5}>
                    {open && (
                      <Sheet variant="soft" sx={{ p: 1, pl: 6, boxShadow: 'inset 0 3px 6px 0 rgba(0 0 0 / 0.08)' }}>
                        <Typography level="body-md" component="div">
                          Permissions
                        </Typography>
                        <Table
                          borderAxis="bothBetween"
                          size="sm"
                          aria-label="purchases"
                          sx={{
                            '--TableCell-headBackground': 'transparent',
                            '--TableCell-selectedBackground': (theme) => theme.vars.palette.success.softBg,
                            '& thead > tr > *:nth-of-type(n)': { width: '100%' },
                          }}
                        >
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Create Date</th>
                              <th>Update Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {row.permissions.map((permission, index) => (
                              <tr key={permission.id}>
                                <td>{permission.name}</td>
                                <td>{permission.createdAt}</td>
                                <td>{permission.updatedAt}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Sheet>
                    )}
                  </td>
                </tr>
              </React.Fragment>
            )
          })}
          {emptyRows > 0 && (
            <tr
              style={{
                height: `calc(${emptyRows} * 40px)`,
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
                <Typography textAlign="center" sx={{ minWidth: 80 }}>
                  {labelDisplayedRows({
                    from: data.length === 0 ? 0 : page * rowsPerPage + 1,
                    to: getLabelDisplayedRowsTo(),
                    count: data.length === -1 ? -1 : data.length,
                  })}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    size="sm"
                    color="neutral"
                    variant="outlined"
                    disabled={page === 0}
                    onClick={() => handleChangePage(page - 1)}
                    sx={{ bgcolor: 'background.surface' }}
                  >
                    <KeyboardArrowLeftIcon />
                  </IconButton>
                  <IconButton
                    size="sm"
                    color="neutral"
                    variant="outlined"
                    disabled={data.length !== -1 ? page >= Math.ceil(data.length / rowsPerPage) - 1 : false}
                    onClick={() => handleChangePage(page + 1)}
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
  )
}
