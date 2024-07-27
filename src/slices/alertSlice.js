import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  visible: false,
  message: '',
  alertType: '',
}

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    showAlert: (state, action) => {
      state.visible = true
      state.message = action.payload.message
      state.alertType = action.payload.alertType
    },
    hideAlert: (state) => {
      state.visible = false
      state.message = ''
    },
  },
})

export const { showAlert, hideAlert } = alertSlice.actions

export default alertSlice.reducer
