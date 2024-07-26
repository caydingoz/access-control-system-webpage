import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import sidebarReducer from './slices/sidebarSlice'
import errorReducer from './slices/errorSlice'

const store = configureStore({ reducer: { auth: authReducer, sidebar: sidebarReducer, error: errorReducer } })
export default store
