import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  themeMode: localStorage.getItem('theme'),
}

const rSuiteThemeSlice = createSlice({
  name: 'rSuiteTheme',
  initialState,
  reducers: {
    setThemeMode: (state, action) => {
      state.themeMode = action.payload
      localStorage.setItem('theme', action.payload)
    },
  },
})

export const { setThemeMode } = rSuiteThemeSlice.actions
export default rSuiteThemeSlice.reducer
