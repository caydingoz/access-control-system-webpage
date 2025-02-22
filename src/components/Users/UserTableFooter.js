import React from 'react'
import { Box, FormControl, FormLabel, Select, Option, IconButton } from '@mui/joy'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'

export default function UserTableFooter({ rowsPerPage, totalCount, page, setPage, handleChangeRowsPerPage }) {
  return (
    <tfoot>
      <tr>
        <td colSpan={9}>
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
              <IconButton size="sm" color="neutral" variant="outlined" disabled={page === 0} onClick={() => setPage(page - 1)}>
                <KeyboardArrowLeftIcon />
              </IconButton>
              <IconButton
                size="sm"
                color="neutral"
                variant="outlined"
                disabled={(page + 1) * rowsPerPage >= totalCount ? true : false}
                onClick={() => setPage(page + 1)}
              >
                <KeyboardArrowRightIcon />
              </IconButton>
            </Box>
          </Box>
        </td>
      </tr>
    </tfoot>
  )
}
