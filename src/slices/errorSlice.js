import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  visible: false,
  message: '',
}

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    showError: (state, action) => {
      state.visible = true
      state.message = action.payload
    },
    hideError: (state) => {
      state.visible = false
      state.message = ''
    },
  },
})

export const { showError, hideError } = errorSlice.actions

export default errorSlice.reducer
