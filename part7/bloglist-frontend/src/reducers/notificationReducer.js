import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    nullNotification(state, action) {
      return null
    },
  },
})

export const { setNotification, nullNotification } = notificationSlice.actions

export default notificationSlice.reducer
