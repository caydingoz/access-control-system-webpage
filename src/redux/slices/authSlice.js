import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isAuthenticated: localStorage.getItem('token') ? true : false,
  tokenInfo: localStorage.getItem('token'),
  user: null,
  roles: null,
  permissions: null,
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
      state.permissions = action.payload.permissions
    },
    setRoles: (state, action) => {
      state.roles = action.payload.roles
      state.permissions = action.payload.permissions
    },
    loggedOut: (state) => {
      state.isAuthenticated = false
      state.tokenInfo = null
      state.user = null
      state.roles = null
      state.permissions = null
    },
  },
})

export const { loggedIn, setRoles, loggedOut } = authSlice.actions

export default authSlice.reducer
