import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  alerts: [],
}

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    showAlert: (state, action) => {
      state.alerts.push(action.payload)
    },
    hideAlert: (state, action) => {
      state.alerts = state.alerts.filter((alert) => alert.id !== action.payload)
    },
  },
})

export const { showAlert, hideAlert } = alertSlice.actions
export default alertSlice.reducer
