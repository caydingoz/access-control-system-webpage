import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from '@coreui/react'
import { hideError } from '../slices/errorSlice'

const Error = () => {
  const dispatch = useDispatch()
  const { visible, message } = useSelector((state) => state.error)

  return (
    <>
      <CModal visible={visible} onClose={() => dispatch(hideError())}>
        <CModalHeader>
          <CModalTitle>Error</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>{message}</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="danger" onClick={() => dispatch(hideError())}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default React.memo(Error)
