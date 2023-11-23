import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isAuthenticated: localStorage.getItem('token') ? true : false,
  tokenInfo: localStorage.getItem('token'),
  user: null,
  roles: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    loggedIn: (state, action) => {
      state.isAuthenticated = true
      state.tokenInfo = localStorage.getItem('token')
      state.user = localStorage.getItem('user')
      state.roles = action.payload.roles
    },
    setRoles: (state, action) => {
      state.roles = action.payload.roles
    },
    loggedOut: (state) => {
      state.isAuthenticated = false
      state.tokenInfo = null
      state.user = null
      state.roles = null
    },
  },
})

export const { loggedIn, loggedOut } = authSlice.actions

export default authSlice.reducer
