import React, { useEffect } from 'react'
import { Box, Table, Typography, Sheet, FormControl, FormLabel, IconButton, Select, Option } from '@mui/joy'
import { Button, Chip, Link } from '@mui/joy'
import { Input, SelectPicker } from 'rsuite'
import { CProgress } from '@coreui/react'
import AbsenceManagementService from 'src/services/AbsenceManagementService'
import { format } from 'date-fns'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import 'src/css/style.css'

export default function UserAbsenceAccuralTable() {
  const [order, setOrder] = React.useState('asc')
  const [orderBy, setOrderBy] = React.useState('firstName')
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [totalCount, setTotalCount] = React.useState(0)
  const [absences, setAbsences] = React.useState([])

  function formatDateTime(inputDateTime) {
    const date = new Date(inputDateTime)
    return format(date, 'dd-MM-yyyy')
  }

  function dateRangeDisplay(startDate, endDate) {
    startDate = new Date(startDate)
    endDate = new Date(endDate)
    const startMonth = startDate.toLocaleString('en-US', { month: 'short' })
    const endMonth = endDate.toLocaleString('en-US', { month: 'short' })
    const startDay = startDate.getDate()
    const endDay = endDate.getDate()
    const endYear = endDate.getFullYear()
    const startYear = startDate.getFullYear()

    return `${startMonth} ${startDay}, ${startYear} - ${endMonth} ${endDay}, ${endYear}`
  }

  const headCells = [
    {
      id: 'annualStart',
      label: 'Annual Start',
    },
    {
      id: 'annualEnd',
      label: 'Annual End',
    },
    {
      id: 'annualDay',
      label: 'Annual Day',
    },
    {
      id: 'usedDay',
      label: 'Used Day',
    },
    {
      id: 'remainingDay',
      label: 'Remaining Day',
    },
    {
      id: 'usage',
      label: 'Usage',
    },
  ]

  useEffect(() => {
    async function fetchData() {
      const res = await AbsenceManagementService.getUserAbsenceInfoAsync(page, rowsPerPage)
      if (res.success) {
        setAbsences(res.data.absenceInfos)
        setTotalCount(res.data.totalCount)
      }
    }
    fetchData()
  }, [page, rowsPerPage])

  const handleChangeRowsPerPage = (event, newValue) => {
    setRowsPerPage(parseInt(newValue.toString(), 10))
    setPage(0)
  }

  const emptyRows = Math.max(0, rowsPerPage - absences.length)

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
            Absences
            <br />
            <Typography level="body-xs" sx={{ fontWeight: 'normal' }}>
              The Absences table stores information about individuals who have access to the application, including their credentials, roles, and
              relevant Absence details.
            </Typography>
          </Typography>
        </Box>
        <Table
          hoverRow
          size="md"
          variant="outlined"
          borderAxis="both"
          sx={{
            boxShadow: 'md',
            width: '96%',
            margin: '1% 2% 2% 2%',
            '--TableCell-selectedBackground': (theme) => theme.vars.palette.primary.softBg,
            '& tbody tr': {
              height: '40px',
            },
            '& tbody td:nth-of-type(1)': {
              paddingLeft: '20px',
              width: '20%',
            },
            '& thead th:nth-of-type(1)': {
              paddingLeft: '20px',
              width: '20%',
            },
            '& thead th:nth-of-type(2)': {
              width: '20%',
            },
            '& thead th:nth-of-type(3)': {
              width: '20%',
            },
            '& thead th:nth-of-type(4)': {
              width: '20%',
            },
            '& thead th:nth-of-type(5)': {
              width: '20%',
            },
            '& thead th:nth-of-type(6)': {
              width: '20%',
            },
            '& tfoot td': {
              backgroundColor: (theme) => theme.vars.palette.background.surface,
            },
          }}
        >
          <thead>
            <tr>
              {headCells.map((headCell) => {
                const active = orderBy === headCell.id
                return (
                  <th
                    key={headCell.id}
                    aria-sort={active ? { asc: 'ascending', desc: 'descending' }[order] : undefined}
                    style={{ verticalAlign: 'top' }}
                  >
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <Link
                      underline="none"
                      color="neutral"
                      component="button"
                      fontWeight="lg"
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        height: '100%',
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
            {absences.length > 0 ? (
              absences.map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`
                const fragmentKey = `row-${index}`
                const usageValue = row.usedDay === 0 ? 0 : ((row.usedDay / row.annualDay) * 100).toFixed(2)
                const color = usageValue < 25 ? 'success' : usageValue < 50 ? 'info' : usageValue < 75 ? 'warning' : 'danger'

                return (
                  <React.Fragment key={fragmentKey}>
                    <tr tabIndex={-1} key={row.id}>
                      <td id={labelId}>
                        <Typography level="body-sm">{formatDateTime(row.annualStart)}</Typography>
                      </td>
                      <td id={labelId}>
                        <Typography level="body-sm">{formatDateTime(row.annualEnd)}</Typography>
                      </td>
                      <td id={labelId}>
                        <Typography level="body-sm">{row.annualDay} day</Typography>
                      </td>
                      <td id={labelId}>
                        <Typography level="body-sm">{row.usedDay} day</Typography>
                      </td>
                      <td id={labelId}>
                        <Typography level="body-sm">{row.remainingDay} day</Typography>
                      </td>
                      <td id={labelId}>
                        <div className="d-flex justify-content-between text-nowrap">
                          <div className="fw-semibold">{usageValue}%</div>
                          <div className="ms-3">
                            <small className="text-body-secondary">{dateRangeDisplay(row.annualStart, row.annualEnd)}</small>
                          </div>
                        </div>
                        <CProgress thin color={color} value={usageValue} />
                      </td>
                    </tr>
                  </React.Fragment>
                )
              })
            ) : (
              <tr
                style={{
                  '--TableRow-hoverBackground': 'transparent',
                }}
              >
                <td colSpan={6} aria-hidden style={{ fontWeight: 'normal', color: 'gray' }}>
                  There is no data..
                </td>
              </tr>
            )}
            {emptyRows > 0 && (
              <tr
                style={{
                  height: `calc(${emptyRows} * 40px)`,
                  '--TableRow-hoverBackground': 'transparent',
                }}
              >
                <td colSpan={6} aria-hidden />
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" colSpan={2} style={{ borderRadius: 0, paddingLeft: '20px' }}>
                Totals
              </th>
              <th scope="row">{absences.reduce((sum, row) => sum + row.annualDay, 0)} day</th>
              <th scope="row">{absences.reduce((sum, row) => sum + row.usedDay, 0)} day</th>
              <th scope="row">{absences.reduce((sum, row) => sum + row.remainingDay, 0)} day</th>
              <th scope="row" style={{ borderRadius: 0 }} />
            </tr>
            <tr>
              <td colSpan={6}>
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
