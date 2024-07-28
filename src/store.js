import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import sidebarReducer from './slices/sidebarSlice'
import alertReducer from './slices/alertSlice'
import loadingSlice from './slices/loadingSlice'

const store = configureStore({ reducer: { auth: authReducer, sidebar: sidebarReducer, alert: alertReducer, loading: loadingSlice } })
export default store
