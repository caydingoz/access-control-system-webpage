import React, { useEffect } from 'react'
import { Box, Table, Typography, Sheet, IconButton, Select, Option } from '@mui/joy'
import { Button, Chip, Link } from '@mui/joy'
import { CProgress } from '@coreui/react'
import AbsenceManagementService from 'src/services/AbsenceManagementService'
import { format } from 'date-fns'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import 'src/css/style.css'

export default function UserAbsenceAccuralTable() {
  const [absences, setAbsences] = React.useState([])

  function formatDateTime(inputDateTime) {
    const date = new Date(inputDateTime)
    return format(date, 'dd-MM-yyyy')
  }

  function getProcessColor(value) {
    const color = value < 25 ? 'success' : value < 50 ? 'info' : value < 75 ? 'warning' : 'danger'
    return color
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
      const res = await AbsenceManagementService.getUserAbsenceInfoAsync()
      if (res.success) {
        setAbsences(res.data.absenceInfos)
      }
    }
    fetchData()
  }, [])

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
        <Box sx={{ maxHeight: 300, overflow: 'auto', borderRadius: 0, width: '96%', margin: '1% 2% 2% 2%' }}>
          <Table
            hoverRow
            stickyHeader
            stickyFooter
            size="md"
            borderAxis="both"
            sx={{
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
                  return (
                    <th key={headCell.id}>
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
                          <CProgress thin color={getProcessColor(usageValue)} value={usageValue} />
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
            </tbody>
            <tfoot>
              <tr>
                <th scope="row" colSpan={2} style={{ borderRadius: 0, paddingLeft: '20px' }}>
                  Totals
                </th>
                <th scope="row">{absences.reduce((sum, row) => sum + row.annualDay, 0)} day</th>
                <th scope="row">{absences.reduce((sum, row) => sum + row.usedDay, 0)} day</th>
                <th scope="row">{absences.reduce((sum, row) => sum + row.remainingDay, 0)} day</th>
                <th scope="row" style={{ borderRadius: 0 }}>
                  <div className="d-flex justify-content-between text-nowrap">
                    <div className="fw-semibold">
                      {(absences.reduce((sum, row) => sum + row.usedDay, 0) / absences.reduce((sum, row) => sum + row.annualDay, 0)) * 100}%
                    </div>
                  </div>
                  <CProgress
                    thin
                    color={getProcessColor(
                      (absences.reduce((sum, row) => sum + row.usedDay, 0) / absences.reduce((sum, row) => sum + row.annualDay, 0)) * 100,
                    )}
                    value={(absences.reduce((sum, row) => sum + row.usedDay, 0) / absences.reduce((sum, row) => sum + row.annualDay, 0)) * 100}
                  />
                </th>
              </tr>
            </tfoot>
          </Table>
        </Box>
      </Sheet>
    </div>
  )
}
