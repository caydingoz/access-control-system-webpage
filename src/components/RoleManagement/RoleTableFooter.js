import React from 'react'
import { Box, IconButton, Typography, FormControl, FormLabel, Select, Option } from '@mui/joy'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'

const RoleTableFooter = ({ page, setPage, rowsPerPage, setRowsPerPage, totalCount, setOpenedId }) => {
  return (
    <Box
      sx={{
        pt: 1.5,
        pb: 1.5,
        pl: 2,
        borderTop: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <FormControl orientation="horizontal" size="sm">
        <FormLabel>Rows per page:</FormLabel>
        <Select
          onChange={(event, newValue) => {
            setRowsPerPage(parseInt(newValue.toString(), 10))
            setPage(0)
            setOpenedId(null)
          }}
          value={rowsPerPage}
          size="sm"
        >
          <Option value={10}>10</Option>
          <Option value={25}>25</Option>
          <Option value={50}>50</Option>
          <Option value={100}>100</Option>
        </Select>
      </FormControl>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pr: 1 }}>
        <IconButton
          size="sm"
          disabled={page === 0}
          onClick={() => {
            setPage(page - 1)
            setOpenedId(null)
          }}
        >
          <KeyboardArrowLeftIcon />
        </IconButton>
        <Typography level="body-sm" sx={{ alignSelf: 'center' }}>
          {page + (totalCount > 0 ? 1 : 0)} / {Math.ceil(totalCount / rowsPerPage)}
        </Typography>
        <IconButton
          size="sm"
          disabled={page >= Math.ceil(totalCount / rowsPerPage) - 1}
          onClick={() => {
            setPage(page + 1)
            setOpenedId(null)
          }}
        >
          <KeyboardArrowRightIcon />
        </IconButton>
      </Box>
    </Box>
  )
}

export default RoleTableFooter
