import { createSelector } from '@reduxjs/toolkit';

export const selectAuth = (state) => state.auth;

export const selectIsAuthenticated = createSelector(
  [selectAuth],
  (auth) => auth.isAuthenticated
)

export const selectHasPermission = (entity, action) =>
  createSelector([selectAuth], (auth) => {
    if (!auth.permissions || !auth.permissions[entity]) return false
    return (auth.permissions[entity] & action) === action
  })

