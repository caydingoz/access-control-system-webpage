import React, { useEffect } from 'react'
import { Box, Table, Typography, Sheet, FormControl, FormLabel, IconButton, Select, Option, Stack } from '@mui/joy'
import { Button, Chip } from '@mui/joy'
import { Input, SelectPicker } from 'rsuite'
import PlusIcon from '@rsuite/icons/Plus'
import { IconButton as RsuiteIconButton } from 'rsuite'
import AbsenceManagementService from 'src/services/AbsenceManagementService'
import { format } from 'date-fns'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import FunnelIcon from '@rsuite/icons/Funnel'

export default function UserAbsenceRequestTable() {
  const [filterDescription, setFilterDescription] = React.useState(null)
  const [filterStatus, setFilterStatus] = React.useState(null)
  const [filterType, setFilterType] = React.useState(null)
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [totalCount, setTotalCount] = React.useState(0)
  const [absences, setAbsences] = React.useState([])

  function formatDateTime(inputDateTime) {
    const date = new Date(inputDateTime)
    return format(date, 'dd-MM-yyyy HH:mm')
  }

  const headCells = [
    {
      id: 'type',
      label: 'Type',
    },
    {
      id: 'status',
      label: 'Status',
    },
    {
      id: 'duration',
      label: 'Duration',
    },
    {
      id: 'startTime',
      label: 'Start Time',
    },
    {
      id: 'endTime',
      label: 'End Time',
    },
    {
      id: 'description',
      label: 'Description',
    },
    {
      id: 'action',
      label: 'Actions',
    },
  ]

  const AbsenceStatus = {
    0: { value: 0, status: 'Pending', color: 'warning' },
    1: { value: 1, status: 'Approved', color: 'success' },
    2: { value: 2, status: 'Rejected', color: 'danger' },
  }
  const AbsenceStatusData = Object.values(AbsenceStatus).map((item) => ({ label: item.status, value: item.value }))

  const AbsenceTypes = {
    0: { value: 0, type: 'Maternity Or Paternity Leave' },
    1: { value: 1, type: 'Marriage Leave' },
    2: { value: 2, type: 'Sick Leave' },
    3: { value: 3, type: 'Sick Leave With Report' },
    4: { value: 4, type: 'Bridge Leave' },
    5: { value: 5, type: 'Excuse Leave' },
    6: { value: 6, type: 'Relocation Leave' },
    7: { value: 7, type: 'Bereavement Leave' },
    8: { value: 8, type: 'Annual Leave' },
    9: { value: 9, type: 'Unpaid Leave' },
    10: { value: 10, type: 'Administrative Leave' },
  }
  const AbsenceTypesData = Object.values(AbsenceTypes).map((item) => ({ label: item.type, value: item.value }))

  useEffect(() => {
    async function fetchData() {
      const res = await AbsenceManagementService.getUserAbsenceRequestsAsync(page, rowsPerPage, filterStatus, filterType, filterDescription)
      if (res.success) {
        setAbsences(res.data.absences)
        setTotalCount(res.data.totalCount)
      }
    }
    fetchData()
  }, [page, rowsPerPage, filterStatus, filterType, filterDescription])

  const handleCancelAbsenceRequest = async (id) => {
    const res = await AbsenceManagementService.deleteAbsenceRequestAsync(id)
    if (res.success) {
      const dataRes = await AbsenceManagementService.getUserAbsenceRequestsAsync(page, rowsPerPage, filterStatus, filterType, filterDescription)
      if (dataRes.success) {
        setAbsences(dataRes.data.absences)
        setTotalCount(dataRes.data.totalCount)
      }
    }
  }

  const handleChangeRowsPerPage = (event, newValue) => {
    setRowsPerPage(parseInt(newValue.toString(), 10))
    setPage(0)
  }

  const emptyRows = Math.max(0, rowsPerPage - absences.length)

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
            My Absence Requests
            <br />
            <Typography level="body-xs" sx={{ fontWeight: 'normal' }}>
              You can view all your leave requests, allowing you to track the status and details of each request. You can view past, pending, and
              approved requests
            </Typography>
          </Typography>
        </Box>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            const formElements = event.currentTarget.elements
            setFilterDescription(formElements.name.value)
            setFilterType(formElements.type.value)
            setFilterStatus(formElements.status.value)
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
                  placeholder="Search for description, etc."
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
                  Type
                </Typography>
                <SelectPicker
                  name="type"
                  size="sm"
                  placeholder="All"
                  variant="outlined"
                  style={{
                    width: '100%',
                    borderRadius: 'sm',
                    boxShadow: 'sm',
                  }}
                  searchable={false}
                  menuStyle={{ width: 180, fontSize: '13px' }}
                  data={AbsenceTypesData}
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
                  }}
                  searchable={false}
                  menuStyle={{ width: 180, fontSize: '13px' }}
                  data={AbsenceStatusData}
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
            <div style={{ marginLeft: '2%', width: '125px' }}>
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
                // onClick={() => setVisibleAddRole((prev) => !prev)}
              >
                Create Request
              </RsuiteIconButton>
            </div>
            <RsuiteIconButton appearance="subtle" size="sm" icon={<FunnelIcon />} style={{ marginRight: '2%' }} disabled />
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
              height: '55px',
            },
            '& tbody td:nth-of-type(1)': {
              paddingLeft: '20px',
              width: '18%',
            },
            '& thead th:nth-of-type(1)': {
              paddingLeft: '20px',
              width: '18%',
            },
            '& thead th:nth-of-type(2)': {
              width: '10%',
            },
            '& thead th:nth-of-type(3)': {
              width: '10%',
            },
            '& thead th:nth-of-type(4)': {
              width: '13%',
            },
            '& thead th:nth-of-type(5)': {
              width: '13%',
            },
            '& thead th:nth-of-type(6)': {
              width: '20%',
            },
            '& thead th:nth-of-type(7)': {
              width: '13%',
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
                  <th key={headCell.id} style={{ verticalAlign: 'middle', textAlign: headCell.label === 'Type' ? '' : 'center' }}>
                    {headCell.label}
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

                return (
                  <React.Fragment key={fragmentKey}>
                    <tr tabIndex={-1} key={row.id}>
                      <td id={labelId}>
                        <Typography level="body-sm" color="primary">
                          {AbsenceTypes[row.type].type}
                        </Typography>
                      </td>
                      <td id={labelId} style={{ textAlign: 'center' }}>
                        <Chip color={AbsenceStatus[row.status].color} size="sm" sx={{ padding: '0 10px' }}>
                          {AbsenceStatus[row.status].status}
                        </Chip>
                      </td>
                      <td id={labelId} style={{ textAlign: 'center' }}>
                        <Typography level="body-sm">{row.duration} day</Typography>
                      </td>
                      <td id={labelId} style={{ textAlign: 'center' }}>
                        <Typography level="body-sm">{formatDateTime(row.startTime)}</Typography>
                      </td>
                      <td id={labelId} style={{ textAlign: 'center' }}>
                        <Typography level="body-sm">{formatDateTime(row.endTime)}</Typography>
                      </td>
                      <td id={labelId}>
                        <Typography level="body-sm" style={{ textAlign: 'center' }}>
                          {row.description.length > 0 ? row.description : '-'}
                        </Typography>
                      </td>
                      <td id={labelId} style={{ borderLeft: '1.5px solid #ddd', borderRadius: '5px' }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Button
                            disabled={row.status !== 0}
                            variant="soft"
                            color="danger"
                            onClick={() => handleCancelAbsenceRequest(row.id)}
                            sx={{ minWidth: '80px', fontWeight: 'bold', fontSize: '13px' }}
                          >
                            Cancel
                          </Button>
                        </Box>
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
                <td colSpan={7} aria-hidden style={{ fontWeight: 'normal', color: 'gray' }}>
                  There is no data..
                </td>
              </tr>
            )}
            {emptyRows > 0 && (
              <tr
                style={{
                  height: `calc(${emptyRows} * 55px)`,
                  '--TableRow-hoverBackground': 'transparent',
                }}
              >
                <td colSpan={7} aria-hidden />
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={7}>
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
