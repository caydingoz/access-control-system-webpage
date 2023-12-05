import React, { useState } from 'react'

import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CPagination,
  CPaginationItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSave, cilTrash, cilChevronBottom, cilChevronTop } from '@coreui/icons'
import TableSortAndSelection from './TestTable'

const RoleManagement = () => {
  const [expandedRows, setExpandedRows] = useState([])

  const toggleRow = (index) => {
    const newExpandedRows = Array(tableExample.length).fill(false)
    newExpandedRows[index] = !expandedRows[index]
    setExpandedRows(newExpandedRows)
  }
  const tableExample = [
    { id: 1, name: 'John Doe', additionalInfo: 'Additional information about John Doe.' },
    { id: 2, name: 'Jane Doe', additionalInfo: 'Additional information about Jane Doe.' },
    { id: 3, name: 'Jane Doe', additionalInfo: 'Additional information about Jane Doe.' },
    { id: 4, name: 'Jane Doe', additionalInfo: 'Additional information about Jane Doe.' },
    { id: 5, name: 'Jane Doe', additionalInfo: 'Additional information about Jane Doe.' },
  ]

  return (
    <React.Fragment>
      <TableSortAndSelection />
      <CRow>
        <CCol>
          <CCard className="border-top-dark border-top-4">
            <CCardHeader className="fs-5 fw-medium">Roles</CCardHeader>
            <CCardBody>
              <CTable align="middle" className="border" responsive="md">
                <CTableHead>
                  <CTableRow color="dark">
                    <CTableHeaderCell />
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Permissions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {tableExample.map((item, index) => (
                    <React.Fragment key={index}>
                      <CTableRow key={`parent_${index}`} color="light" active={expandedRows[index]}>
                        <CTableDataCell className="text-center">
                          <CButton color="danger" variant="outline">
                            <CIcon icon={cilTrash} />
                          </CButton>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>{item.name}</div>
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <CButton color="secondary" onClick={() => toggleRow(index)}>
                            <CIcon icon={expandedRows[index] ? cilChevronTop : cilChevronBottom} />
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                      {expandedRows[index] && (
                        <CTableRow key={`expanded_${index}`} colSpan={4}>
                          <CTableHeaderCell colSpan={4}>
                            <CCard className="fw-normal">
                              <CCardHeader className="fs-6 fw-medium">Permissions</CCardHeader>
                              <CCardBody>
                                <CTable align="middle" className="border" hover responsive>
                                  <CTableHead color="primary">
                                    <CTableRow className="fs-6">
                                      <CTableHeaderCell />
                                      <CTableHeaderCell className="fw-normal">Operation</CTableHeaderCell>
                                      <CTableHeaderCell className="fw-normal">Permission Types</CTableHeaderCell>
                                      <CTableHeaderCell />
                                    </CTableRow>
                                  </CTableHead>
                                  <CTableBody>
                                    {tableExample.map((item, subIndex) => (
                                      <CTableRow key={subIndex} className="fs-6 fw-light">
                                        <CTableDataCell className="text-center">
                                          <CButton color="danger" variant="outline">
                                            <CIcon icon={cilTrash} />
                                          </CButton>
                                        </CTableDataCell>
                                        <CTableDataCell>
                                          <div>{item.name}</div>
                                        </CTableDataCell>
                                        <CTableDataCell>
                                          <div>{item.name}</div>
                                        </CTableDataCell>
                                        <CTableDataCell className="text-center">
                                          <CButton color="warning">
                                            <CIcon icon={cilSave} />
                                          </CButton>
                                        </CTableDataCell>
                                      </CTableRow>
                                    ))}
                                  </CTableBody>
                                </CTable>
                                <CPagination align="start">
                                  <CPaginationItem aria-label="Previous" disabled>
                                    <span aria-hidden="true">&laquo;</span>
                                  </CPaginationItem>
                                  <CPaginationItem active>1</CPaginationItem>
                                  <CPaginationItem>2</CPaginationItem>
                                  <CPaginationItem>3</CPaginationItem>
                                  <CPaginationItem aria-label="Next">
                                    <span aria-hidden="true">&raquo;</span>
                                  </CPaginationItem>
                                </CPagination>
                              </CCardBody>
                            </CCard>
                          </CTableHeaderCell>
                        </CTableRow>
                      )}
                    </React.Fragment>
                  ))}
                </CTableBody>
              </CTable>
              <CPagination align="center">
                <CPaginationItem aria-label="Previous" disabled>
                  <span aria-hidden="true">&laquo;</span>
                </CPaginationItem>
                <CPaginationItem active>1</CPaginationItem>
                <CPaginationItem>2</CPaginationItem>
                <CPaginationItem>3</CPaginationItem>
                <CPaginationItem aria-label="Next">
                  <span aria-hidden="true">&raquo;</span>
                </CPaginationItem>
              </CPagination>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </React.Fragment>
  )
}

export default RoleManagement
