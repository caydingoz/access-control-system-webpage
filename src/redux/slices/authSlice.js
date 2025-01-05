import { createSlice } from '@reduxjs/toolkit'
import axiosClient from '../../helpers/axiosClient'

const initialState = {
  isAuthenticated: localStorage.getItem('token') ? true : false,
  tokenInfo: localStorage.getItem('token'),
  user: localStorage.getItem('user'),
  roles: null,
  permissions: null,
  loading: true,
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
      state.loading = false
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

export const fetchUserPermissions = () => async (dispatch) => {
  const response = await axiosClient.getAsync('auth/roles-and-permissions')
  dispatch(setRoles({ roles: response.data.roles, permissions: response.data.permissions }))
}

export const { loggedIn, setRoles, loggedOut } = authSlice.actions

export default authSlice.reducer
